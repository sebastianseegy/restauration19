import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Speise' | 'Wein'>('all');
  const [bulkBusy, setBulkBusy] = useState(false);

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

  const handleToggle = async (item: MenuItem) => {
    await updateDoc(doc(db, 'menuItems', item.id), { isActive: !item.isActive });
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)));
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.Typ === filter);

  const setAllFilteredActive = async (active: boolean) => {
    if (filtered.length === 0) return;
    setBulkBusy(true);
    try {
      const batch = writeBatch(db);
      filtered.forEach(item => {
        batch.update(doc(db, 'menuItems', item.id), { isActive: active });
      });
      await batch.commit();
      setItems(prev =>
        prev.map(i => (filtered.some(f => f.id === i.id) ? { ...i, isActive: active } : i))
      );
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">SPEISEKARTE</h1>
          <p className="text-sm text-gray-500">{items.length} Einträge</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <Link
            to="/backend/menu/new"
            className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
          >
            + HINZUFÜGEN
          </Link>
        </div>
      </div>

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
          <div className="flex gap-2 ml-auto flex-wrap">
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => setAllFilteredActive(true)}
              className="text-xs tracking-widest px-3 py-2 rounded-lg border border-green-200 text-green-800 bg-green-50 hover:bg-green-100 disabled:opacity-50"
            >
              ALLE ANZEIGEN ({filter === 'all' ? 'alle' : filter})
            </button>
            <button
              type="button"
              disabled={bulkBusy}
              onClick={() => setAllFilteredActive(false)}
              className="text-xs tracking-widest px-3 py-2 rounded-lg border border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              ALLE AUSBLENDEN ({filter === 'all' ? 'alle' : filter})
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
                  checked={item.isActive}
                  onChange={() => handleToggle(item)}
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