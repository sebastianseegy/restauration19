import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NoIndexHead from '../../components/NoIndexHead';

const navItems = [
  { to: '/backend/dashboard', label: 'ÜBERSICHT' },
  { to: '/backend/menu', label: 'SPEISEKARTE' },
  { to: '/backend/current-menu', label: 'AKTUELLE KARTE' },
];

export default function BackendLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/backend/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NoIndexHead />
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed top-0 bottom-0">
        <div className="p-6 border-b border-gray-100">
          <img src="/logo.png" alt="Restauration19" className="h-8 opacity-80" />
          <p className="text-[10px] tracking-widest text-gray-400 mt-2">BACKEND</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-xs tracking-widest px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 truncate mb-3">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-xs tracking-widest text-gray-500 hover:text-gray-900 py-2 transition-colors text-left"
          >
            ABMELDEN
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        <Outlet />
      </main>
    </div>
  );
}
