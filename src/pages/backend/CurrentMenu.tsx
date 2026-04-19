import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  MenuItem,
  SPEISE_KATEGORIEN,
  WEIN_KATEGORIEN,
  displaySpeisePreis,
  displayWeinFlascheLine,
  displayWeinPreisLine,
} from '../../types/menu';
import { Link } from 'react-router-dom';

export default function CurrentMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [draftActive, setDraftActive] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);

  const effectiveActive = (item: MenuItem) =>
    draftActive[item.id] !== undefined ? draftActive[item.id]! : item.isActive;

  const hasUnsavedChanges = useMemo(
    () => items.some(i => effectiveActive(i) !== i.isActive),
    [items, draftActive]
  );

  useEffect(() => {
    getDocs(collection(db, 'menuItems'))
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        setItems(data.filter(i => i.Typ && i.Titel));
        setDraftActive({});
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleDraft = (item: MenuItem) => {
    const cur = effectiveActive(item);
    const next = !cur;
    setDraftActive(prev => {
      const p = { ...prev };
      if (next === item.isActive) delete p[item.id];
      else p[item.id] = next;
      return p;
    });
  };

  const handleSaveVisibility = async () => {
    const changed = items.filter(i => effectiveActive(i) !== i.isActive);
    if (changed.length === 0) return;
    setSaveBusy(true);
    try {
      const batch = writeBatch(db);
      changed.forEach(item => {
        batch.update(doc(db, 'menuItems', item.id), { isActive: effectiveActive(item) });
      });
      await batch.commit();
      setItems(prev =>
        prev.map(i => {
          const eff = effectiveActive(i);
          return eff !== i.isActive ? { ...i, isActive: eff } : i;
        })
      );
      setDraftActive({});
    } finally {
      setSaveBusy(false);
    }
  };

  const speisen = items.filter(i => i.Typ === 'Speise' && effectiveActive(i));
  const weine = items.filter(i => i.Typ === 'Wein' && effectiveActive(i));
  const inactive = items.filter(i => !effectiveActive(i));

  const speisenKats = Array.from(new Set([...SPEISE_KATEGORIEN, ...speisen.map(i => i.Kategorie)]));
  const weinKats = Array.from(new Set([...WEIN_KATEGORIEN, ...weine.map(i => i.Kategorie)]));

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">AKTUELLE KARTE</h1>
          <p className="text-sm text-gray-500">{speisen.length} Speisen · {weine.length} Weine aktiv</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!hasUnsavedChanges || saveBusy}
            onClick={handleSaveVisibility}
            className={`text-xs tracking-widest px-5 py-2.5 rounded-lg transition-colors ${
              hasUnsavedChanges
                ? 'bg-gray-900 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            SPEICHERN
          </button>
          <button
            type="button"
            disabled={!hasUnsavedChanges || saveBusy}
            onClick={() => setDraftActive({})}
            className={`text-xs tracking-widest px-4 py-2.5 rounded-lg border transition-colors ${
              hasUnsavedChanges
                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            VERWERFEN
          </button>
          <Link to="/backend/menu/new"
            className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
            + HINZUFÜGEN
          </Link>
        </div>
      </div>

      {/* Infozeile — immer reserviert, nur sichtbar bei Änderungen (kein Layout-Shift) */}
      <p className={`text-xs rounded-lg px-4 py-2 border transition-all ${
        hasUnsavedChanges
          ? 'text-amber-800 bg-amber-50 border-amber-200'
          : 'text-transparent bg-transparent border-transparent select-none pointer-events-none'
      }`}>
        Sichtbarkeit geändert — <strong>SPEICHERN</strong>, damit die Genuss-Seite aktualisiert wird.
      </p>

      {/* Speisekarte preview */}
      <MenuSection title="SPEISEKARTE" kategorien={speisenKats} items={speisen} onToggle={toggleDraft} />

      {/* Weinkarte preview */}
      <MenuSection title="WEINAUSWAHL" kategorien={weinKats} items={weine} onToggle={toggleDraft} isWein />

      {/* Inactive items */}
      {inactive.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-widest text-gray-400 mb-3">NICHT AUF DER KARTE ({inactive.length})</h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {inactive.map((item, i) => (
              <div key={item.id}
                className={`flex items-center gap-4 px-6 py-3 ${i !== inactive.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <span className={`text-[10px] tracking-widest px-2 py-0.5 rounded flex-shrink-0 ${
                  item.Typ === 'Wein' ? 'bg-purple-50 text-purple-400' : 'bg-orange-50 text-orange-400'
                }`}>{item.Typ.toUpperCase()}</span>
                <div className="flex-1 min-w-0 opacity-50">
                  <p className="text-sm text-gray-600">{item.Titel}</p>
                  <p className="text-[10px] text-gray-400">{item.Kategorie}</p>
                </div>
                <p className="text-sm text-gray-400 flex-shrink-0">
                  {item.Typ === 'Wein'
                    ? displayWeinPreisLine(item.Preis)
                    : displaySpeisePreis(item.Preis)}
                  {item.Typ === 'Wein' && item.Preis_Flasche && (
                    <span className="block text-xs text-gray-400 mt-0.5">
                      {displayWeinFlascheLine(item.Preis_Flasche)}
                    </span>
                  )}
                </p>
                <button onClick={() => toggleDraft(item)}
                  className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-700 transition-colors flex-shrink-0">
                  AKTIVIEREN
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuSection({ title, kategorien, items, onToggle, isWein }: {
  title: string;
  kategorien: string[];
  items: MenuItem[];
  onToggle: (item: MenuItem) => void;
  isWein?: boolean;
}) {
  const activeKats = kategorien.filter(k => items.some(i => i.Kategorie === k));

  return (
    <div>
      <h2 className="text-[10px] tracking-widest text-gray-400 mb-3">{title}</h2>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-xs text-gray-300 tracking-widest">NOCH KEINE EINTRÄGE</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {activeKats.map(kat => {
            const katItems = items.filter(i => i.Kategorie === kat);
            if (katItems.length === 0) return null;
            return (
              <div key={kat}>
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-[10px] tracking-widest text-gray-500">{kat}</span>
                </div>
                {katItems.map((item, i) => (
                  <div key={item.id}
                    className={`flex items-center gap-4 px-6 py-3 ${i !== katItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{item.Titel}</p>
                      {item.Beschreibung && <p className="text-xs text-gray-400">{item.Beschreibung}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-gray-900">
                        {isWein ? displayWeinPreisLine(item.Preis) : displaySpeisePreis(item.Preis)}
                      </p>
                      {isWein && item.Preis_Flasche && (
                        <p className="text-xs text-gray-400">{displayWeinFlascheLine(item.Preis_Flasche)}</p>
                      )}
                    </div>
                    <button onClick={() => onToggle(item)}
                      className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0">
                      ENTFERNEN
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
