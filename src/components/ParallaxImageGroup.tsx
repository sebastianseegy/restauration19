import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface ImageProps {
  src: string;
  alt: string;
}

export function ParallaxImageGroup({ images }: { images: ImageProps[] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Morphen/Parallax effect: move up slightly as we scroll down
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={ref} className="flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-6xl">
      {images.map((img, idx) => {
        return (
          <motion.div 
            key={idx}
            style={{ y }}
            className="w-full flex-1 max-w-md"
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
