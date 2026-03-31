import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/90 backdrop-blur-sm">
        {/* Logo */}
        <Link to="/" className="z-50 flex items-center">
          {/* 
            Hier ist das Bildfeld für das offizielle Logo. 
            Ersetze "logo.svg" durch den Pfad zu deinem PNG (z.B. "/logo.png"), 
            sobald du die Datei im "public" Ordner abgelegt hast.
          */}
          <img 
            src="/logo.png" 
            alt="RESTAURATION19 Logo" 
            className="h-10 md:h-14 w-auto"
          />
        </Link>

        {/* Burger Menu */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col items-end gap-1.5 cursor-pointer z-[70] group"
          aria-label="Menu"
        >
          <div className={`h-[2px] transition-all duration-300 group-hover:bg-brand-pink ${isMenuOpen ? 'bg-brand-pink w-8 rotate-45 translate-y-2' : 'bg-black w-6'}`}></div>
          <div className={`h-[2px] transition-all duration-300 group-hover:bg-brand-pink ${isMenuOpen ? 'bg-brand-pink w-4 opacity-0' : 'bg-black w-4'}`}></div>
          <div className={`h-[2px] transition-all duration-300 group-hover:bg-brand-pink ${isMenuOpen ? 'bg-brand-pink w-8 -rotate-45 -translate-y-2' : 'bg-black w-8'}`}></div>
        </button>
      </header>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Invisible Backdrop to close when clicking outside */}
            <div 
              className="fixed inset-0 z-[55]" 
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-24 right-6 bg-white shadow-xl border border-gray-100 p-8 z-[60] flex flex-col"
            >
              <nav className="flex flex-col gap-6 text-lg tracking-[0.2em] text-right">
                <Link to="/genuss" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-pink transition-colors">Genuss</Link>
                <Link to="/events" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-pink transition-colors">Events</Link>
                <Link to="/team" onClick={() => setIsMenuOpen(false)} className="hover:text-brand-pink transition-colors">Team</Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-36 pb-32 md:pb-48 px-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-green text-white py-12 px-6 lg:px-12 w-full mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {/* Address/Contact (Top) */}
          <div className="flex flex-col items-start text-left gap-1 text-xs tracking-widest">
            <p>RESTAURATION19</p>
            <a 
              href="https://maps.google.com/?q=Helmstraße+19,+90419+Nürnberg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-brand-pink transition-colors"
            >
              HELMSTRASSE 19, 90419 NÜRNBERG
            </a>
            <p className="mt-2">
              KONTAKT: <a href="mailto:info@restauration19.de" className="hover:text-brand-pink transition-colors">INFO@RESTAURATION19.DE</a>
            </p>
            <p className="mt-2">
              INSTAGRAM: <a href="https://instagram.com/restauration19_nbg" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink transition-colors">RESTAURATION19_NBG</a>
            </p>
            
            <div className="mt-2">
              <p>ÖFFNUNGSZEITEN:</p>
              <p className="mt-1">MO. – FR.: 17:00 – 22:00 UHR</p>
              <p className="mt-1">SA: PRIVATE VERANSTALTUNG NACH VEREINBARUNG</p>
            </div>
          </div>

          {/* Legal Links (Bottom) */}
          <div className="flex flex-col items-start text-left gap-2 text-xs tracking-widest">
            <Link to="/impressum" className="hover:text-brand-pink transition-colors">IMPRESSUM</Link>
            <Link to="/datenschutz" className="hover:text-brand-pink transition-colors">DATENSCHUTZ</Link>
            <Link to="/agb" className="hover:text-brand-pink transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
