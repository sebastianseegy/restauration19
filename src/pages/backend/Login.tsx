import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/backend/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/backend/dashboard');
    } catch {
      setError('E-Mail oder Passwort falsch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Restauration19" className="h-10 mx-auto mb-6 opacity-80" />
          <p className="text-sm tracking-widest text-gray-500">BACKEND</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest text-gray-500">E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest text-gray-500">PASSWORT</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white text-xs tracking-widest py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'ANMELDEN...' : 'ANMELDEN'}
          </button>
        </form>
      </div>
    </div>
  );
}
