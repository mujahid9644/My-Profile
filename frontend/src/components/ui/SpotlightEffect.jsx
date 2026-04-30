import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SpotlightEffect({ mousePosition }) {
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (mousePosition) {
      // Smooth follow with easing
      setSpotlightPos((prev) => ({
        x: prev.x + (mousePosition.x - prev.x) * 0.2,
        y: prev.y + (mousePosition.y - prev.y) * 0.2,
      }));
      setIsActive(true);
    }
  }, [mousePosition]);

  return (
    <>
      {/* Outer dark overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: isActive
            ? `radial-gradient(circle 300px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)`
            : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 10 }}
      />

      {/* Spotlight glow core */}
      <motion.div
        className="fixed pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          left: spotlightPos.x - 200,
          top: spotlightPos.y - 200,
          background: isActive
            ? `radial-gradient(circle, rgba(var(--glow-color), 0.3) 0%, rgba(var(--glow-color), 0.1) 50%, transparent 100%)`
            : 'transparent',
          filter: 'blur(40px)',
          opacity: isActive ? 0.8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 25, damping: 8 }}
      />

      {/* Inner bright circle */}
      <motion.div
        className="fixed pointer-events-none border border-white/20 rounded-full"
        style={{
          width: '280px',
          height: '280px',
          left: spotlightPos.x - 140,
          top: spotlightPos.y - 140,
          background: isActive
            ? `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)`
            : 'transparent',
          boxShadow: isActive
            ? `inset 0 0 80px rgba(var(--glow-color), 0.2), 0 0 60px rgba(var(--glow-color), 0.15)`
            : 'none',
          opacity: isActive ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 25, damping: 8 }}
      />

      {/* Ring effect */}
      {isActive && (
        <motion.div
          className="fixed pointer-events-none border-2 border-white/10 rounded-full"
          style={{
            width: '180px',
            height: '180px',
            left: spotlightPos.x - 90,
            top: spotlightPos.y - 90,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </>
  );
}
