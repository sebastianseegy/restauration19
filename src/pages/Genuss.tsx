import { useEffect, useState } from 'react';
import { fetchMenuData, MenuItem } from '../services/googleSheets';
import { ParallaxImageGroup } from '../components/ParallaxImageGroup';

export default function Genuss() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await fetchMenuData();
      setMenuItems(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Feste Kategorien — immer angezeigt, auch wenn keine aktiven Gerichte vorhanden
  const speisenKategorien = ['KLEINIGKEITEN', 'WARME GERICHTE', 'SÜSSES'];
  const weinKategorien = ['SCHAUMWEIN', 'WEISSWEIN', 'ROTWEIN'];

  const speisen = menuItems.filter(item => item.Typ === 'Speise');
  const weine = menuItems.filter(item => item.Typ === 'Wein');

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
              {speisenKategorien.map((kategorie) => (
                <div key={kategorie}>
                  <h3 className="text-xl mb-6 text-brand-green uppercase">{kategorie}</h3>
                  {speisen.filter(s => s.Kategorie === kategorie).map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 py-4 gap-4">
                      <div className="flex flex-col items-start text-left flex-1">
                        <span className="uppercase">{item.Titel}</span>
                        {item.Beschreibung && <span className="text-xs text-gray-500 mt-1 uppercase text-left">{item.Beschreibung}</span>}
                      </div>
                      <span className="whitespace-nowrap">{item.Preis}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto w-full flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl mb-8 text-center">AKTUELLE WEINAUSWAHL</h2>
        
        {/* Große Darstellung der Weinkarte mit leichtem Schattenrahmen in grün */}
        <div className="w-full max-w-3xl bg-white p-8 md:p-16 shadow-[0_8px_40px_rgb(94,116,97,0.25)] border border-brand-green/10">
          {weine.length === 0 ? (
            <p className="text-sm text-gray-400 tracking-widest text-center">AKTUELLE WEINAUSWAHL FOLGT IN KÜRZE</p>
          ) : (
            <div className="flex flex-col gap-12 text-sm md:text-base">
              {weinKategorien.map((kategorie) => (
                <div key={kategorie}>
                  <h3 className="text-xl mb-6 text-brand-green uppercase">{kategorie}</h3>
                  {weine.filter(w => w.Kategorie === kategorie).map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 py-4 gap-4">
                      <div className="flex flex-col items-start text-left flex-1">
                        <span className="uppercase">{item.Titel}</span>
                        {item.Beschreibung && <span className="text-xs text-gray-500 mt-1 uppercase text-left">{item.Beschreibung}</span>}
                      </div>
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <span>{item.Preis}</span>
                        {item.Preis_Flasche && <span className="text-xs text-gray-500 mt-1 uppercase">{item.Preis_Flasche}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
