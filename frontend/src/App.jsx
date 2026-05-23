import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Certifications from './components/Certifications.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Chatbot from './components/Chatbot.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';
import Services from './components/Services.jsx';
import Experience from './components/Experience.jsx';
import FloatingSocials from './components/ui/FloatingSocials.jsx';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const unlockScroll = () => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      unlockScroll();
    }, 3600);

    return () => {
      clearTimeout(timer);
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      return undefined;
    }

    let wheelHandled = false;
    let touchHandled = false;
    let touchStartY = 0;

    const recoverScroll = (startX, startY, deltaX, deltaY) => {
      window.requestAnimationFrame(() => {
        const scrollDidNotMove = window.scrollX === startX && window.scrollY === startY;

        if (scrollDidNotMove && (deltaX !== 0 || deltaY !== 0)) {
          window.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' });
        }
      });
    };

    const handleFirstWheel = (event) => {
      if (wheelHandled) {
        return;
      }

      wheelHandled = true;
      recoverScroll(window.scrollX, window.scrollY, event.deltaX, event.deltaY);
      window.removeEventListener('wheel', handleFirstWheel, true);
    };

    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleFirstTouchMove = (event) => {
      if (touchHandled) {
        return;
      }

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - currentY;

      touchHandled = true;
      recoverScroll(window.scrollX, window.scrollY, 0, deltaY);
      window.removeEventListener('touchmove', handleFirstTouchMove, true);
      window.removeEventListener('touchstart', handleTouchStart, true);
    };

    window.addEventListener('wheel', handleFirstWheel, { capture: true, passive: true });
    window.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    window.addEventListener('touchmove', handleFirstTouchMove, { capture: true, passive: true });

    return () => {
      window.removeEventListener('wheel', handleFirstWheel, true);
      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('touchmove', handleFirstTouchMove, true);
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <AnimatePresence onExitComplete={unlockScroll}>
        {isLoading && <Loader key="initial-loader" />}
      </AnimatePresence>

      <div className="relative z-10">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              'radial-gradient(circle at 10% 12%, rgba(var(--glow-color), 0.18), transparent 38rem), radial-gradient(circle at 85% 18%, rgba(124, 141, 255, 0.14), transparent 36rem), linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          }}
        />
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,rgba(var(--glow-color),.12)_0,transparent_40%),radial-gradient(circle_at_80%_65%,rgba(124,141,255,.12)_0,transparent_42%)]" />
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(var(--glow-color),.08)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--glow-color),.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <Navbar />
        <FloatingSocials />
        <main>
          <Hero />
          <Certifications />
          <Skills />
          <Projects />
          <Services />
          <About />
          <Experience />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
}
