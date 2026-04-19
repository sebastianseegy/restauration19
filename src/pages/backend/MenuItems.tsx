import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  MenuItem,
  compareMenuKategorie,
  displaySpeisePreis,
  displayWeinFlascheLine,
  displayWeinPreisLine,
} from '../../types/menu';
import { Link } from 'react-router-dom';

export default function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  /** Lokale Überschreibungen für „auf Karte“ — erst nach SPEICHERN in Firestore / auf Genuss sichtbar */
  const [draftActive, setDraftActive] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Speise' | 'Wein'>('all');
  const [bulkBusy, setBulkBusy] = useState(false);

  const effectiveActive = (item: MenuItem) =>
    draftActive[item.id] !== undefined ? draftActive[item.id]! : item.isActive;

  const hasUnsavedChanges = useMemo(
    () => items.some(i => effectiveActive(i) !== i.isActive),
    [items, draftActive]
  );

  const fetchItems = async () => {
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
      const valid = data.filter(i => i.Typ && i.Titel);
      valid.sort(
        (a, b) =>
          a.Typ.localeCompare(b.Typ) ||
          compareMenuKategorie(a.Typ, a.Kategorie || '', b.Kategorie || '') ||
          (a.Titel || '').localeCompare(b.Titel || '', 'de')
      );
      setItems(valid);
      setDraftActive({});
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Dieses Item wirklich löschen?')) return;
    await deleteDoc(doc(db, 'menuItems', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

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
    setBulkBusy(true);
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
      setBulkBusy(false);
    }
  };

  const discardDraft = () => setDraftActive({});

  const filtered = filter === 'all' ? items : items.filter(i => i.Typ === filter);

  /** Setzt nur den Entwurf (Sichtbarkeit), ohne zu speichern */
  const setAllFilteredDraft = (active: boolean) => {
    if (filtered.length === 0) return;
    setDraftActive(prev => {
      const p = { ...prev };
      filtered.forEach(item => {
        if (active === item.isActive) delete p[item.id];
        else p[item.id] = active;
      });
      return p;
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">SPEISEKARTE</h1>
          <p className="text-sm text-gray-500">{items.length} Einträge</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end items-center">
          <Link
            to="/backend/menu/new"
            className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
          >
            + HINZUFÜGEN
          </Link>
        </div>
      </div>

      {/* Infozeile — immer reserviert, kein Layout-Shift */}
      <p className={`text-xs rounded-lg px-4 py-2 border transition-all ${
        hasUnsavedChanges
          ? 'text-amber-800 bg-amber-50 border-amber-200'
          : 'text-transparent bg-transparent border-transparent select-none pointer-events-none'
      }`}>
        Ungespeicherte Änderungen — <strong>SPEICHERN</strong>, damit die Karte öffentlich aktualisiert wird.
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        {(['all', 'Speise', 'Wein'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs tracking-widest px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f === 'all' ? 'ALLE' : f.toUpperCase()}
          </button>
        ))}
        {filtered.length > 0 && (
          <div className="flex gap-2 ml-auto flex-wrap items-center">
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => setAllFilteredDraft(true)}
              className="text-xs tracking-widest px-3 py-2 rounded-lg border border-green-200 text-green-800 bg-green-50 hover:bg-green-100 disabled:opacity-50"
            >
              ALLE ANZEIGEN ({filter === 'all' ? 'alle' : filter})
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => setAllFilteredDraft(false)}
              className="text-xs tracking-widest px-3 py-2 rounded-lg border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              ALLE AUSBLENDEN ({filter === 'all' ? 'alle' : filter})
            </button>
            <button
              type="button"
              disabled={!hasUnsavedChanges || bulkBusy}
              onClick={handleSaveVisibility}
              className={`text-xs tracking-widest px-4 py-2 rounded-lg transition-colors ${
                hasUnsavedChanges
                  ? 'bg-gray-900 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              SPEICHERN
            </button>
            <button
              type="button"
              disabled={!hasUnsavedChanges || bulkBusy}
              onClick={discardDraft}
              className={`text-xs tracking-widest px-3 py-2 rounded-lg border transition-colors ${
                hasUnsavedChanges
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              VERWERFEN
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-400">Noch keine Einträge.</p>
          <Link
            to="/backend/menu/new"
            className="text-xs tracking-widest text-gray-900 mt-3 inline-block underline"
          >
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 sm:px-6 py-4 ${
                i !== filtered.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <label className="flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={effectiveActive(item)}
                  onChange={() => toggleDraft(item)}
                  className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                />
                <span className="sr-only">Auf der Karte sichtbar</span>
              </label>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] tracking-widest px-2 py-0.5 rounded ${
                      item.Typ === 'Wein' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {item.Typ.toUpperCase()}
                  </span>
                  <span className="text-[10px] tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {item.Kategorie}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mt-1 uppercase">{item.Titel}</p>
                {item.Beschreibung && <p className="text-xs text-gray-400 uppercase">{item.Beschreibung}</p>}
              </div>

              <div className="text-right flex-shrink-0 hidden sm:block">
                {item.Typ === 'Wein' ? (
                  item.Preis ? (
                    // FALL: Glaspreis vorhanden -> Glas oben, Flasche klein darunter
                    <>
                      <p className="text-sm text-gray-900">{displayWeinPreisLine(item.Preis)}</p>
                      {item.Preis_Flasche && (
                        <p className="text-xs text-gray-400">{displayWeinFlascheLine(item.Preis_Flasche)}</p>
                      )}
                    </>
                  ) : (
                    // FALL: Nur Flasche -> Flaschenpreis steht prominent oben im "Glas-Slot"
                    <p className="text-sm text-gray-900">{displayWeinFlascheLine(item.Preis_Flasche || '')}</p>
                  )
                ) : (
                  // FALL: Speise -> Normaler Preis
                  <p className="text-sm text-gray-900">{displaySpeisePreis(item.Preis)}</p>
                )}
              </div>

              <div className="flex gap-1 flex-shrink-0 ml-4">
                <Link
                  to={`/backend/menu/${item.id}`}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors px-2 py-1"
                >
                  BEARBEITEN
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-red-300 hover:text-red-500 transition-colors px-2 py-1"
                >
                  LÖSCHEN
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}