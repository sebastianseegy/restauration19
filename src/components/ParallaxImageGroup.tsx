import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
}

export function ParallaxImageGroup({ images }: { images: ImageProps[] }) {
  const ref = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], isMobile ? [3, -3] : [15, -15]);

  return (
    <div ref={ref} className="flex flex-row flex-wrap justify-center items-start gap-3 md:gap-12 w-full max-w-6xl">
      {images.map((img, idx) => {
        return (
          <motion.div 
            key={idx}
            style={{ y }}
            className="w-[47%] md:w-auto md:flex-1 md:max-w-md"
          >
            <div className="relative w-full aspect-[3/4] shadow-[0_8px_30px_rgb(94,116,97,0.2)]">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
