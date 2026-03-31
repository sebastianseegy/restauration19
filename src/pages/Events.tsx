import { ParallaxImageGroup } from '../components/ParallaxImageGroup';

export default function Events() {
  const eventImages = [
    { src: "/photos/events/events-1.jpg", alt: "Restauration19 Events" },
    { src: "/photos/events/events-2.jpg", alt: "Restauration19 Events" }
  ];

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex flex-col items-center w-full gap-12">
        <section className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <h1 className="text-2xl md:text-3xl">EVENTS</h1>
          <p className="text-lg md:text-xl leading-relaxed">
            AUCH SAMSTAGS STEHT DIE RESTAURATION19 NACH VEREINBARUNG FÜR PRIVATE VERANSTALTUNGEN ZUR VERFÜGUNG. OB IN UNSERER LOCATION ODER ALS HOME COOKING EVENT BEI EUCH ZU HAUSE - WIR SCHAFFEN DEN PASSENDEN RAHMEN FÜR BESONDERE ANLÄSSE. GEMEINSAM PLANEN WIR EINEN TAG/ABEND GANZ NACH EUREN VORSTELLUNGEN - MIT GENUSSKÜCHE, GUTEM WEIN UND DER GEWOHNTEN LOCKEREN ATMOSPHÄRE DER 19.
          </p>
        </section>
      </div>

      <ParallaxImageGroup images={eventImages} />
    </div>
  );
}
