import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/backend/ProtectedRoute';

import Layout from './components/Layout';
import Home from './pages/Home';
import Genuss from './pages/Genuss';
import Team from './pages/Team';
import Events from './pages/Events';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';

import Login from './pages/backend/Login';
import BackendLayout from './pages/backend/BackendLayout';
import Dashboard from './pages/backend/Dashboard';
import MenuItems from './pages/backend/MenuItems';
import MenuItemForm from './pages/backend/MenuItemForm';
import CurrentMenu from './pages/backend/CurrentMenu';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public website */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="genuss" element={<Genuss />} />
            <Route path="team" element={<Team />} />
            <Route path="events" element={<Events />} />
            <Route path="impressum" element={<Impressum />} />
            <Route path="datenschutz" element={<Datenschutz />} />
            <Route path="agb" element={<AGB />} />
          </Route>

          {/* Backend — hidden from public navigation */}
          <Route path="/backend" element={<Navigate to="/backend/login" replace />} />
          <Route path="/backend/login" element={<Login />} />
          <Route
            path="/backend"
            element={
              <ProtectedRoute>
                <BackendLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuItems />} />
            <Route path="menu/:id" element={<MenuItemForm />} />
            <Route path="current-menu" element={<CurrentMenu />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
