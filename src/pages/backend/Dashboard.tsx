import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { MenuItem } from '../../types/menu';
import { Link } from 'react-router-dom';

interface Stats {
  totalItems: number;
  activeItems: number;
  categories: Record<string, number>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ totalItems: 0, activeItems: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snap = await getDocs(collection(db, 'menuItems'));
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        const categories: Record<string, number> = {};
        items.forEach(item => {
          categories[item.category] = (categories[item.category] || 0) + 1;
        });
        setStats({
          totalItems: items.length,
          activeItems: items.filter(i => i.isActive).length,
          categories,
        });
      } catch {
        // Firebase not yet configured
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-xs tracking-widest text-gray-400 mb-1">ÜBERSICHT</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="MENÜ-EINTRÄGE GESAMT" value={loading ? '–' : String(stats.totalItems)} />
        <StatCard label="AKTUELL AKTIV" value={loading ? '–' : String(stats.activeItems)} accent />
        <StatCard label="KATEGORIEN" value={loading ? '–' : String(Object.keys(stats.categories).length)} />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-xs tracking-widest text-gray-400 mb-4">SCHNELLZUGRIFF</h2>
        <div className="flex flex-col gap-2">
          <Link
            to="/backend/menu/new"
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">+</span>
            Neues Menü-Item hinzufügen
          </Link>
          <Link
            to="/backend/menu"
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">≡</span>
            Alle Menü-Items verwalten
          </Link>
          <Link
            to="/backend/current-menu"
            className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg">◎</span>
            Aktuelle Karte anzeigen
          </Link>
        </div>
      </div>

      {/* Category breakdown */}
      {!loading && Object.keys(stats.categories).length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-xs tracking-widest text-gray-400 mb-4">NACH KATEGORIE</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(stats.categories).map(([cat, count]) => (
              <div key={cat} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700 capitalize">{cat}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-100'}`}>
      <p className={`text-[10px] tracking-widest mb-2 ${accent ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-3xl font-light ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
