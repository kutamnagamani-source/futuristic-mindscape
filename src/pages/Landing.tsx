import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import { Scene3D } from "@/components/Scene3D";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { bindGlobalListeners, measureZones } from "@/lib/pointer";


export default function Landing() {
  const [booted, setBooted] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => bindGlobalListeners(), []);

  // Re-measure 3D zone windows once real content is mounted
  useEffect(() => {
    if (booted) measureZones();
  }, [booted]);

  return (
    <>
      <LoadingScreen onDone={() => setBooted(true)} />

      <CustomCursor />

      {/* Cinematic scroll progress hairline */}
      <motion.div
        style={{ scaleX: progress }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-cyan-400/80 via-violet-400/80 to-emerald-300/80"
        aria-hidden="true"
      />

      {/* The 3D world — mounted behind everything, self-healing if WebGL fails */}
      <Scene3D />

      {/* Vignette + noise layers above the canvas, below content */}
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_90%_70%_at_50%_40%,transparent_55%,rgba(5,5,7,0.75)_100%)]" aria-hidden="true" />

      {/* Content mounts after the loader so entrance animations play post-reveal */}
      {booted && (
        <>
          <Navbar />

          {/* Animated separately from the navbar: a filter/transform on this
              wrapper would create a containing block and break the fixed navbar. */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none relative z-10"
          >
            <main className="pointer-events-none">
              <Hero />
              <About />
              <Skills />
              <Contact />
            </main>

            <Footer />
          </motion.div>
        </>
      )}
    </>
  );
}
