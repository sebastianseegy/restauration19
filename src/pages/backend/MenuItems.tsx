import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { MenuItem, CATEGORY_LABELS } from '../../types/menu';
import { Link } from 'react-router-dom';

export default function MenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchItems = async () => {
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
      data.sort((a, b) => a.category.localeCompare(b.category));
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Dieses Item wirklich löschen?')) return;
    await deleteDoc(doc(db, 'menuItems', id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleToggleActive = async (item: MenuItem) => {
    await updateDoc(doc(db, 'menuItems', item.id), { isActive: !item.isActive });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
  };

  const filtered = items.filter(i => {
    if (filter === 'active') return i.isActive;
    if (filter === 'inactive') return !i.isActive;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">SPEISEKARTE</h1>
          <p className="text-sm text-gray-500">{items.length} Einträge</p>
        </div>
        <Link
          to="/backend/menu/new"
          className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + HINZUFÜGEN
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'active', 'inactive'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs tracking-widest px-4 py-2 rounded-lg transition-colors ${
              filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f === 'all' ? 'ALLE' : f === 'active' ? 'AKTIV' : 'INAKTIV'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-400">Noch keine Einträge.</p>
          <Link to="/backend/menu/new" className="text-xs tracking-widest text-gray-900 mt-3 inline-block underline">
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-6 py-4 ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">–</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name?.de || '–'}</p>
                  <span className="text-[10px] tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                    {CATEGORY_LABELS[item.category] || item.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{item.description?.de || ''}</p>
                {item.allergens?.length > 0 && (
                  <p className="text-[10px] text-gray-300 mt-0.5">{item.allergens.join(', ')}</p>
                )}
              </div>

              {/* Price */}
              <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                {item.price ? `${item.price.toFixed(2)} €` : '–'}
              </p>

              {/* Active toggle */}
              <button
                onClick={() => handleToggleActive(item)}
                className={`text-[10px] tracking-widest px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  item.isActive
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {item.isActive ? 'AKTIV' : 'INAKTIV'}
              </button>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
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
