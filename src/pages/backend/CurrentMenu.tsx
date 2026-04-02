import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'menuItems'))
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        setItems(data.filter(i => i.Typ && i.Titel));
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (item: MenuItem) => {
    await updateDoc(doc(db, 'menuItems', item.id), { isActive: !item.isActive });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
  };

  const speisen = items.filter(i => i.Typ === 'Speise' && i.isActive);
  const weine = items.filter(i => i.Typ === 'Wein' && i.isActive);
  const inactive = items.filter(i => !i.isActive);

  const speisenKats = Array.from(new Set([...SPEISE_KATEGORIEN, ...speisen.map(i => i.Kategorie)]));
  const weinKats = Array.from(new Set([...WEIN_KATEGORIEN, ...weine.map(i => i.Kategorie)]));

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xs tracking-widest text-gray-400 mb-1">AKTUELLE KARTE</h1>
          <p className="text-sm text-gray-500">{speisen.length} Speisen · {weine.length} Weine aktiv</p>
        </div>
        <Link to="/backend/menu/new"
          className="bg-gray-900 text-white text-xs tracking-widest px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors">
          + HINZUFÜGEN
        </Link>
      </div>

      {/* Speisekarte preview */}
      <MenuSection title="SPEISEKARTE" kategorien={speisenKats} items={speisen} onToggle={handleToggle} />

      {/* Weinkarte preview */}
      <MenuSection title="WEINAUSWAHL" kategorien={weinKats} items={weine} onToggle={handleToggle} isWein />

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
                <button onClick={() => handleToggle(item)}
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
