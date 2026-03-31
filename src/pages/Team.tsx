import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Team() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div className="flex flex-col items-center gap-16 md:gap-32">
      <div className="flex flex-col items-center w-full gap-6 md:gap-12">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-lg md:text-3xl">TEAM</h1>
        </section>

        {/* 3 Bilder mit Abstand nebeneinander, nicht versetzte Höhen. */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 w-full max-w-6xl">
        
        {/* FLO */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ y }}
          className="flex flex-col items-center gap-3 md:gap-8"
        >
          <div className="w-2/3 md:w-full aspect-[3/4] shadow-[0_8px_30px_rgb(94,116,97,0.2)]">
            <img 
              src="/photos/team/team-flo.jpg" 
              alt="Flo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-xs md:text-sm leading-relaxed gap-1 md:gap-2 text-center">
            <h3 className="text-sm md:text-xl mb-1 md:mb-2 font-medium">FLO</h3>
            <p>POSITION: GASTGEBER MIT LEIDENSCHAFT UND ORGANISATION</p>
            <p>FAIBLE FÜR: TECHNIK UND SICH DREHENDES VINYL</p>
            <p>VERSTECKTES TALENT: VERHINDERTER HANDWERKER</p>
          </div>
        </motion.div>

        {/* KRISPIN */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ y }}
          className="flex flex-col items-center gap-3 md:gap-8"
        >
          <div className="w-2/3 md:w-full aspect-[3/4] shadow-[0_8px_30px_rgb(94,116,97,0.2)]">
            <img 
              src="/photos/team/team-krispin.jpg" 
              alt="Krispin" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-xs md:text-sm leading-relaxed gap-1 md:gap-2 text-center">
            <h3 className="text-sm md:text-xl mb-1 md:mb-2 font-medium">KRISPIN</h3>
            <p>POSITION: GENIALER KOCH MIT GROSSEM ENTHUSIASMUS</p>
            <p>FAIBLE FÜR: WEINFLASCHENENTKORKEN UND PINK PONG</p>
            <p>VERSTECKTES TALENT: TROCKENER HUMOR</p>
          </div>
        </motion.div>

        {/* PASCAL */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ y }}
          className="flex flex-col items-center gap-3 md:gap-8"
        >
          <div className="w-2/3 md:w-full aspect-[3/4] shadow-[0_8px_30px_rgb(94,116,97,0.2)]">
            <img 
              src="/photos/team/team-pascal.jpg" 
              alt="Pascal" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center text-xs md:text-sm leading-relaxed gap-1 md:gap-2 text-center">
            <h3 className="text-sm md:text-xl mb-1 md:mb-2 font-medium">PASCAL</h3>
            <p>POSITION: BEGEISTERTER KOCH, MANN FÜR ALLE FÄLLE</p>
            <p>FAIBLE FÜR: SIEBTRÄGERMASCHINEN UND RENNRÄDER</p>
            <p>VERSTECKTES TALENT: BRAUCHT KEINE LEITER</p>
          </div>
        </motion.div>

        </div>
      </div>
    </div>
  );
}
