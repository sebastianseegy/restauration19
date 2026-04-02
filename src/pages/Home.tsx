import { ParallaxImageGroup } from '../components/ParallaxImageGroup';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-16 md:gap-32">
      <div className="flex flex-col items-center w-full gap-8 md:gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-sm md:text-xl leading-relaxed">
            RESTAURATION19, EIN RESTAURANT IM BISTROSTIL - <br />
            EINFACH(E) GENUSSKÜCHE UND BESONDERE WEINAUSWAHL
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-1.jpg', alt: 'Restauration19 – Bistro in Nürnberg, Helmstraße 19' },
            { src: '/photos/home/home-2.jpg', alt: 'Saisonale Genussküche im Restauration19 Nürnberg' },
            { src: '/photos/home/home-3.jpg', alt: 'Weinauswahl im Restauration19 Bistro Nürnberg' },
          ]} 
        />
      </div>

      <div className="flex flex-col items-center w-full gap-8 md:gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-sm md:text-xl leading-relaxed">
            WIR SIND DREI LEIDENSCHAFTLICHE KÖCHE MIT GROSSER BEGEISTERUNG FÜR GUTES, EINFACHES ESSEN. IN DER 19 GIBT ES DAS, WAS WIR AUCH ZU HAUSE GERNE SERVIEREN. WIR LIEBEN DIE KULINARIK ZWISCHEN NÜRNBERG UND ROM, KLEINE AUSFLÜGE IN ANDERE REGIONEN SIND ABER NICHT AUSGESCHLOSSEN.
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-4.jpg', alt: 'Frische, biologische Zutaten im Restauration19 Nürnberg' },
            { src: '/photos/home/home-5.jpg', alt: 'Küche und Speisen im Bistro Restauration19 Nürnberg' },
          ]} 
        />
      </div>

      <div className="flex flex-col items-center w-full gap-8 md:gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-sm md:text-xl leading-relaxed">
            MIT DEM AMBIENTE GREIFEN WIR DEN STIL UNSERER KÜCHE AUF. HIER KANN MAN SICH WOHLFÜHLEN UND GESELLIGKEIT GENIESSEN.
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-6.jpg', alt: 'Ambiente im Restauration19 Bistro Nürnberg' },
            { src: '/photos/home/home-7.jpg', alt: 'Gastraum des Restauration19 in der Helmstraße 19 Nürnberg' },
            { src: '/photos/home/home-8.jpg', alt: 'Geselligkeit im Restaurant Restauration19 Nürnberg' },
          ]} 
        />
      </div>
    </div>
  );
}
