import { ParallaxImageGroup } from '../components/ParallaxImageGroup';

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-32">
      <div className="flex flex-col items-center w-full gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl leading-relaxed">
            RESTAURATION19, EIN RESTAURANT IM BISTROSTIL - <br />
            EINFACH(E) GENUSSKÜCHE UND BESONDERE WEINAUSWAHL
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-1.jpg', alt: 'Restauration19' },
            { src: '/photos/home/home-2.jpg', alt: 'Restauration19' },
            { src: '/photos/home/home-3.jpg', alt: 'Restauration19' },
          ]} 
        />
      </div>

      <div className="flex flex-col items-center w-full gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl leading-relaxed">
            WIR SIND DREI LEIDENSCHAFTLICHE KÖCHE MIT GROSSER BEGEISTERUNG FÜR GUTES, EINFACHES ESSEN. IN DER 19 GIBT ES DAS, WAS WIR AUCH ZU HAUSE GERNE SERVIEREN. WIR LIEBEN DIE KULINARIK ZWISCHEN NÜRNBERG UND ROM, KLEINE AUSFLÜGE IN ANDERE REGIONEN SIND ABER NICHT AUSGESCHLOSSEN.
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-4.jpg', alt: 'Restauration19' },
            { src: '/photos/home/home-5.jpg', alt: 'Restauration19' },
          ]} 
        />
      </div>

      <div className="flex flex-col items-center w-full gap-12">
        <section className="max-w-4xl mx-auto">
          <p className="text-lg md:text-xl leading-relaxed">
            MIT DEM AMBIENTE GREIFEN WIR DEN STIL UNSERER KÜCHE AUF. HIER KANN MAN SICH WOHLFÜHLEN UND GESELLIGKEIT GENIESSEN.
          </p>
        </section>

        <ParallaxImageGroup 
          images={[
            { src: '/photos/home/home-6.jpg', alt: 'Restauration19' },
            { src: '/photos/home/home-7.jpg', alt: 'Restauration19' },
            { src: '/photos/home/home-8.jpg', alt: 'Restauration19' },
          ]} 
        />
      </div>
    </div>
  );
}
