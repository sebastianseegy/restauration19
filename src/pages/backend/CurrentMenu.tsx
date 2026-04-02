import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { MenuItem, MenuCategory, CATEGORY_LABELS } from '../../types/menu';
import { Link } from 'react-router-dom';

const CATEGORY_ORDER: MenuCategory[] = ['vorspeise', 'hauptgericht', 'dessert', 'wein', 'getraenke', 'snacks'];

export default function CurrentMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, 'menuItems'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        setItems(data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleToggle = async (item: MenuItem) => {
    await updateDoc(doc(db, 'menuItems', item.id), { isActive: !item.isActive });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
  };

  const activeItems = items.filter(i => i.isActive);
  const inactiveItems = items.filter(i => !i.isActive);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = activeItems.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">AKTUELLE KARTE</h1>
          <p className="text-sm text-gray-500">{activeItems.length} aktive Gerichte</p>
        </div>
        <Link
          to="/backend/menu/new"
          className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + HINZUFÜGEN
        </Link>
      </div>

      {/* Active menu grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-sm text-gray-400 tracking-widest">AKTUELLE KARTE FOLGT IN KÜRZE</p>
          <Link to="/backend/menu/new" className="text-xs tracking-widest text-gray-900 mt-3 inline-block underline">
            Ersten Eintrag erstellen
          </Link>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="text-[10px] tracking-widest text-gray-500 font-medium">
                {CATEGORY_LABELS[cat as MenuCategory]}
              </h2>
            </div>
            {catItems.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-6 py-4 ${i !== catItems.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                {item.imageUrl && (
                  <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.name?.de}</p>
                  {item.name?.en && (
                    <p className="text-xs text-gray-400">{item.name.en}</p>
                  )}
                  {item.description?.de && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{item.description.de}</p>
                  )}
                  {item.allergens?.length > 0 && (
                    <p className="text-[10px] text-gray-300 mt-0.5">{item.allergens.join(', ')}</p>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                  {item.price ? `${item.price.toFixed(2)} €` : ''}
                </p>
                <button
                  onClick={() => handleToggle(item)}
                  className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  ENTFERNEN
                </button>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Inactive items — available to add back */}
      {inactiveItems.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-widest text-gray-400 mb-3">NICHT AUF DER KARTE</h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {inactiveItems.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-6 py-3 opacity-50 ${i !== inactiveItems.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600">{item.name?.de}</p>
                  <p className="text-[10px] text-gray-400">{CATEGORY_LABELS[item.category]}</p>
                </div>
                <p className="text-sm text-gray-500 flex-shrink-0">
                  {item.price ? `${item.price.toFixed(2)} €` : ''}
                </p>
                <button
                  onClick={() => handleToggle(item)}
                  className="text-[10px] tracking-widest px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-700 transition-colors flex-shrink-0"
                >
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
