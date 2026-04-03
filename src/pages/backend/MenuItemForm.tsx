import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  MenuItem,
  MenuTyp,
  SPEISE_KATEGORIEN,
  WEIN_KATEGORIEN,
  WeinGlasMl,
  compareMenuKategorie,
  composeWeinFlascheString,
  composeWeinPreisString,
  displaySpeisePreis,
  displayWeinFlascheLine,
  displayWeinPreisLine,
  parseWeinPrices,
  stripEurAmount,
} from '../../types/menu';
import { getMenuMeta, type MenuMeta } from '../../services/menuMeta';

const EMPTY: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> = {
  Typ: 'Speise',
  Kategorie: 'KLEINIGKEITEN',
  Titel: '',
  Beschreibung: '',
  Preis: '',
  Preis_Flasche: '',
  isActive: true,
};

function mergeCategoryOptions(
  typ: MenuTyp,
  meta: MenuMeta,
  current: string
): string[] {
  const defaults = typ === 'Speise' ? SPEISE_KATEGORIEN : WEIN_KATEGORIEN;
  const custom = typ === 'Speise' ? meta.customSpeiseKategorien : meta.customWeinKategorien;
  const set = new Set<string>([...defaults, ...custom]);
  if (current && !set.has(current)) set.add(current);
  return [...set].sort((a, b) => compareMenuKategorie(typ, a, b));
}

export default function MenuItemForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [menuMeta, setMenuMeta] = useState<MenuMeta>({
    customSpeiseKategorien: [],
    customWeinKategorien: [],
  });

  // Festgelegt auf 0,125 l (Konstante statt State, da keine Auswahl mehr nötig)
  const weinGlas: WeinGlasMl = '0,125' as any; 
  const [eurGlas, setEurGlas] = useState('');
  const [eurFlasche, setEurFlasche] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categoryOptions = useMemo(
    () => mergeCategoryOptions(form.Typ, menuMeta, form.Kategorie),
    [form.Typ, form.Kategorie, menuMeta]
  );

  const syncWeinFromStrings = useCallback((preis: string, flasche: string) => {
    const p = parseWeinPrices(preis || '', flasche || '');
    // setWeinGlas(p.glas); // ENTFERNT, da weinGlas jetzt fest ist
    setEurGlas(p.eurGlas);
    setEurFlasche(p.eurFlasche);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meta = await getMenuMeta();
        if (cancelled) return;
        setMenuMeta(meta);

        if (!isNew && id) {
          const snap = await getDoc(doc(db, 'menuItems', id));
          if (cancelled) return;
          if (snap.exists()) {
            const d = snap.data() as MenuItem;
            const typ = d.Typ || 'Speise';
            setForm({
              Typ: typ,
              Kategorie: d.Kategorie || '',
              Titel: d.Titel || '',
              Beschreibung: d.Beschreibung || '',
              Preis: typ === 'Speise' ? stripEurAmount(d.Preis || '') : d.Preis || '',
              Preis_Flasche: d.Preis_Flasche || '',
              isActive: d.isActive ?? true,
            });
            if (typ === 'Wein') {
              const rawP = d.Preis || '';
              const rawF = d.Preis_Flasche || '';
              const parsed = parseWeinPrices(rawP, rawF);
              // #region agent log
              fetch('http://127.0.0.1:7711/ingest/62dceb90-f7b3-4b26-8b77-f2b6f88b9abe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5beee5'},body:JSON.stringify({sessionId:'5beee5',runId:'pre-fix',hypothesisId:'H1',location:'MenuItemForm.tsx:wein-load',message:'Wein doc parse',data:{id,rawPreisLen:rawP.length,rawFlascheLen:rawF.length,parsedEurGlas:parsed.eurGlas,parsedEurFlasche:parsed.eurFlasche},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
              syncWeinFromStrings(rawP, rawF);
            }
          }
        }
      } finally {
        if (!cancelled) {
          // #region agent log
          fetch('http://127.0.0.1:7711/ingest/62dceb90-f7b3-4b26-8b77-f2b6f88b9abe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5beee5'},body:JSON.stringify({sessionId:'5beee5',runId:'pre-fix',hypothesisId:'H2',location:'MenuItemForm.tsx:load-finally',message:'load finished',data:{isNew,loadId:id,cancelled},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew, syncWeinFromStrings]);

  const handleTypChange = (typ: MenuTyp) => {
    const defaultKat = typ === 'Speise' ? SPEISE_KATEGORIEN[0] : WEIN_KATEGORIEN[0];
    if (typ === 'Wein') {
      setEurGlas('');
      setEurFlasche('');
      setForm(prev => ({
        ...prev,
        Typ: typ,
        Kategorie: defaultKat,
        Preis: '',
        Preis_Flasche: '',
      }));
    } else {
      setForm(prev => ({ ...prev, Typ: typ, Kategorie: defaultKat }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.Titel.trim()) {
      setError('Titel ist erforderlich.');
      return;
    }

    let preis = form.Preis;
    let preisFlasche = form.Preis_Flasche || '';

    if (form.Typ === 'Wein') {
      // Nur Flaschenpreis ist zwingend erforderlich
      if (!eurFlasche.trim()) {
        setError('Der Preis für die Flasche ist erforderlich.');
        return;
      }
      // Glas-Preis wird nur generiert, wenn das Feld ausgefüllt wurde
      preis = eurGlas.trim() ? composeWeinPreisString(eurGlas) : '';
      preisFlasche = composeWeinFlascheString(eurFlasche);
    } else {
      if (!form.Preis.trim()) {
        setError('Preis ist erforderlich.');
        return;
      }
      preis = stripEurAmount(form.Preis.trim());
    }

    setSaving(true);
    setError('');
    try {
      const now = new Date().toISOString();
      const docId = isNew ? `${Date.now()}` : id!;
      // #region agent log
      const opts = mergeCategoryOptions(form.Typ, menuMeta, form.Kategorie);
      fetch('http://127.0.0.1:7711/ingest/62dceb90-f7b3-4b26-8b77-f2b6f88b9abe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5beee5'},body:JSON.stringify({sessionId:'5beee5',runId:'pre-fix',hypothesisId:'H5',location:'MenuItemForm.tsx:submit-inputs',message:'submit computed prices',data:{typ:form.Typ,eurGlas,eurFlasche,preis,preisFlasche,formPreis:form.Preis,h4Kategorie:form.Kategorie,h4InOptions:opts.includes(form.Kategorie)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      const data: MenuItem = {
        id: docId,
        ...form,
        Preis: preis,
        Preis_Flasche: form.Typ === 'Wein' ? preisFlasche : '',
        Beschreibung: form.Beschreibung || '',
        updatedAt: now,
        createdAt: isNew ? now : (await getDoc(doc(db, 'menuItems', docId))).data()?.createdAt || now,
      };
      // #region agent log
      const undefKeys = Object.entries(data as unknown as Record<string, unknown>).filter(([, v]) => v === undefined).map(([k]) => k);
      fetch('http://127.0.0.1:7711/ingest/62dceb90-f7b3-4b26-8b77-f2b6f88b9abe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5beee5'},body:JSON.stringify({sessionId:'5beee5',runId:'pre-fix',hypothesisId:'H3',location:'MenuItemForm.tsx:submit-data',message:'payload before write',data:{docId,isNew,undefKeys,keys:Object.keys(data)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion

      if (isNew) {
        await setDoc(doc(db, 'menuItems', docId), data);
      } else {
        await updateDoc(doc(db, 'menuItems', docId), { ...data });
      }
      navigate('/backend/menu');
    } catch (err) {
      // #region agent log
      const e = err as { code?: string; message?: string };
      fetch('http://127.0.0.1:7711/ingest/62dceb90-f7b3-4b26-8b77-f2b6f88b9abe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'5beee5'},body:JSON.stringify({sessionId:'5beee5',runId:'pre-fix',hypothesisId:'H3',location:'MenuItemForm.tsx:submit-catch',message:'save failed',data:{code:e?.code,msg:e?.message},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setError('Fehler beim Speichern. Bitte erneut versuchen.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const previewTitle = form.Titel.trim() || '–';
  const showDescPreview = Boolean(form.Beschreibung?.trim());

  const fieldCls =
    'border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-white w-full';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-2xl">
      <div className="flex items-center justify-between w-full gap-4">
        <button
          type="button"
          onClick={() => navigate('/backend/menu')}
          className="text-xs tracking-widest text-gray-500 hover:text-gray-900 transition-colors shrink-0"
        >
          ← ZURÜCK
        </button>
        <h1 className="text-xs tracking-widest text-gray-400 text-right flex-1">
          {isNew ? 'NEUES ITEM' : 'ITEM BEARBEITEN'}
        </h1>
      </div>

      {/* Typ */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-700 tracking-wide">TYP</label>
        <div className="flex gap-2">
          {(['Speise', 'Wein'] as MenuTyp[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypChange(t)}
              className={`text-xs tracking-widest px-6 py-2.5 rounded-lg transition-colors flex-1 ${
                form.Typ === t
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Kategorie */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-700 tracking-wide">KATEGORIE</label>
        <select
          value={form.Kategorie}
          onChange={e => setForm(prev => ({ ...prev, Kategorie: e.target.value }))}
          className={fieldCls}
        >
          {categoryOptions.map(k => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {/* Titel */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-700 tracking-wide">TITEL *</label>
        <input
          type="text"
          value={form.Titel}
          onChange={e => setForm(prev => ({ ...prev, Titel: e.target.value.toUpperCase() }))}
          className={fieldCls}
        />
      </div>

      {/* Beschreibung */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-700 tracking-wide">
          BESCHREIBUNG {form.Typ === 'Wein' ? '(Weingut, Herkunft)' : '(Optional)'}
        </label>
        <input
          type="text"
          value={form.Beschreibung}
          onChange={e => setForm(prev => ({ ...prev, Beschreibung: e.target.value.toUpperCase() }))}
          className={fieldCls}
        />
      </div>

      {/* Preis Speise */}
      {form.Typ === 'Speise' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-700 tracking-wide">PREIS *</label>
          <input
            type="text"
            value={form.Preis}
            onChange={e => setForm(prev => ({ ...prev, Preis: e.target.value }))}
            className={fieldCls}
          />
        </div>
      )}

      {/* Preis Wein */}
      {form.Typ === 'Wein' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700 tracking-wide">PREIS GLAS (0,125 l)</label>
            <input
              type="text"
              placeholder="Optional (leer lassen für nur Flasche)"
              value={eurGlas}
              onChange={e => setEurGlas(e.target.value)}
              className={fieldCls}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700 tracking-wide">PREIS FLASCHE *</label>
            <input
              type="text"
              value={eurFlasche}
              onChange={e => setEurFlasche(e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>
      )}

      {/* Active toggle */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className={`text-xs tracking-widest w-16 text-right ${!form.isActive ? 'text-gray-900 font-medium' : 'text-gray-300'}`}>
          INAKTIV
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={form.isActive}
          onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.isActive ? 'bg-gray-900' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-[left] duration-200 ease-out ${form.isActive ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'}`} />
        </button>
        <span className={`text-xs tracking-widest w-16 ${form.isActive ? 'text-gray-900 font-medium' : 'text-gray-300'}`}>
          AKTIV
        </span>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <p className="text-[10px] tracking-widest text-gray-400 mb-4">VORSCHAU</p>
        <div className="flex justify-between border-b border-gray-200 py-3 gap-4">
          <div className="flex flex-col items-start text-left flex-1 min-w-0">
            <span className="text-base font-semibold text-gray-900 uppercase leading-snug">
              {previewTitle}
            </span>
            {showDescPreview && (
              <span className="text-sm text-gray-600 mt-2 uppercase leading-relaxed">
                {form.Beschreibung}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end whitespace-nowrap text-sm shrink-0">
            {form.Typ === 'Wein' ? (
              <>
                {eurGlas && (
                  <span className="text-gray-900">
                    {displayWeinPreisLine(composeWeinPreisString(eurGlas))}
                  </span>
                )}
                {eurFlasche && (
                  <span className="text-sm text-gray-600 mt-1">
                    {displayWeinFlascheLine(composeWeinFlascheString(eurFlasche))}
                  </span>
                )}
                {!eurGlas && !eurFlasche && <span className="text-gray-900">–</span>}
              </>
            ) : (
              <span className="text-gray-900">
                {form.Preis.trim() ? displaySpeisePreis(form.Preis) : '–'}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-xs tracking-widest px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'SPEICHERN...' : 'SPEICHERN'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/backend/menu')}
          className="text-xs tracking-widest text-gray-500 hover:text-gray-900 px-4 py-3 transition-colors"
        >
          ABBRECHEN
        </button>
      </div>
    </form>
  );
}