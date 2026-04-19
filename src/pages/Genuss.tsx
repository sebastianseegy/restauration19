import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import {
  MenuItem,
  SPEISE_KATEGORIEN,
  displaySpeisePreis,
  displayWeinFlascheLine,
  displayWeinPreisLine,
} from '../types/menu';
import { ParallaxImageGroup } from '../components/ParallaxImageGroup';

export default function Genuss() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'menuItems'))
      .then(snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as MenuItem[];
        setMenuItems(data.filter(i => i.isActive && i.Typ && i.Titel));
      })
      .catch(() => setMenuItems([]))
      .finally(() => setLoading(false));
  }, []);

  const weinKategorien = ['SCHAUMWEIN', 'WEISSWEIN', 'ROTWEIN'];

  const speisen = menuItems.filter(item => item.Typ === 'Speise');
  const weine = menuItems.filter(item => item.Typ === 'Wein');

  /** Standard-Reihenfolge + evtl. ältere Kategorien aus Firestore (z. B. WARME GERICHTE) */
  const speisenKategorien = useMemo(() => {
    const fromData = [...new Set(speisen.map(s => s.Kategorie))];
    const known = SPEISE_KATEGORIEN as readonly string[];
    const extra = fromData.filter(k => !known.includes(k));
    extra.sort((a, b) => a.localeCompare(b, 'de'));
    return [...SPEISE_KATEGORIEN, ...extra];
  }, [speisen]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm tracking-widest">LADE KARTE...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-32">
      <section className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl mb-8 text-center">AKTUELLE KARTE</h2>
        
        {/* Große Darstellung der Menükarte mit leichtem Schattenrahmen in grün */}
        <div className="w-full max-w-3xl bg-white p-8 md:p-16 shadow-[0_8px_40px_rgb(94,116,97,0.25)] border border-brand-green/10">
          {speisen.length === 0 ? (
            <p className="text-sm text-gray-400 tracking-widest text-center">AKTUELLE KARTE FOLGT IN KÜRZE</p>
          ) : (
            <div className="flex flex-col gap-12 text-sm md:text-base">
              {speisenKategorien.map((kategorie) => {
                const katItems = speisen.filter(s => s.Kategorie === kategorie);
                if (katItems.length === 0) return null;
                return (
                <div key={kategorie}>
                  <h3 className="text-xl mb-6 text-brand-green uppercase">{kategorie}</h3>
                  {katItems.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 py-4 gap-4">
                      <div className="flex flex-col items-start text-left flex-1">
                        <span className="uppercase">{item.Titel}</span>
                        {item.Beschreibung && <span className="text-xs text-gray-500 mt-1 uppercase text-left">{item.Beschreibung}</span>}
                      </div>
                      <span className="whitespace-nowrap">{displaySpeisePreis(item.Preis)}</span>
                    </div>
                  ))}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl mb-8 text-center">BESONDERE WEINE</h2>
        
        {/* Große Darstellung der Weinkarte mit leichtem Schattenrahmen in grün */}
        <div className="w-full max-w-3xl bg-white p-8 md:p-16 shadow-[0_8px_40px_rgb(94,116,97,0.25)] border border-brand-green/10">
          {weine.length === 0 ? (
            <p className="text-sm text-gray-400 tracking-widest text-center">AKTUELLE WEINAUSWAHL FOLGT IN KÜRZE</p>
          ) : (
            <div className="flex flex-col gap-12 text-sm md:text-base">
              {weinKategorien.map((kategorie) => {
                const katItems = weine.filter(w => w.Kategorie === kategorie);
                if (katItems.length === 0) return null;
                return (
                <div key={kategorie}>
                  <h3 className="text-xl mb-6 text-brand-green uppercase">{kategorie}</h3>
                  {katItems.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 py-4 gap-4">
                      <div className="flex flex-col items-start text-left flex-1">
                        <span className="uppercase">{item.Titel}</span>
                        {item.Beschreibung && <span className="text-xs text-gray-500 mt-1 uppercase text-left">{item.Beschreibung}</span>}
                      </div>
                      <div className="flex flex-col items-end whitespace-nowrap">
                        {item.Preis ? (
                          <>
                            <span>{displayWeinPreisLine(item.Preis)}</span>
                            {item.Preis_Flasche && (
                              <span className="text-xs text-gray-500 mt-1 uppercase">
                                {displayWeinFlascheLine(item.Preis_Flasche)}
                              </span>
                            )}
                          </>
                        ) : (
                          <span>{displayWeinFlascheLine(item.Preis_Flasche ?? '')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ParallaxImageGroup images={[
        { src: "/photos/genuss/genuss-1.jpg", alt: "Restauration19 Genuss" },
        { src: "/photos/genuss/genuss-2.jpg", alt: "Restauration19 Genuss" },
        { src: "/photos/genuss/genuss-3.jpg", alt: "Restauration19 Genuss" }
      ]} />
    </div>
  );
}
