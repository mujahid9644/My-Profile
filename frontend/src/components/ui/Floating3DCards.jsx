import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const portfolioCards = [
  {
    id: 1,
    title: 'AI SalesBot',
    description: 'LLM-powered lead capture',
    color: 'from-blue-500/20 to-cyan-500/20',
    position: 'top-12 left-0 rotate-12 z-30',
    zIndex: 30,
  },
  {
    id: 2,
    title: 'React Dashboard',
    description: 'Real-time analytics UI',
    color: 'from-purple-500/20 to-pink-500/20',
    position: 'top-0 left-12 -rotate-6 z-40',
    zIndex: 40,
  },
  {
    id: 3,
    title: 'Django API',
    description: 'Scalable backend system',
    color: 'from-green-500/20 to-emerald-500/20',
    position: 'top-24 left-32 -rotate-3 z-20',
    zIndex: 20,
  },
  {
    id: 4,
    title: 'Portfolio Site',
    description: 'Modern UI showcase',
    color: 'from-orange-500/20 to-red-500/20',
    position: 'top-40 right-0 rotate-6 z-10',
    zIndex: 10,
  },
];

export default function Floating3DCards({ mousePosition, spotlightDistance }) {
  const containerRef = useRef(null);
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, []);

  // Calculate 3D rotation based on mouse position
  const calculateRotation = (card) => {
    if (!mousePosition) return { rotateX: 0, rotateY: 0 };

    const cardCenterX = containerPos.x + (card.zIndex % 10) * 30 - 75;
    const cardCenterY = containerPos.y + Math.floor(card.zIndex / 10) * 40 - 50;

    const deltaX = (mousePosition.y - cardCenterY) / 20;
    const deltaY = (mousePosition.x - cardCenterX) / 20;

    return {
      rotateX: Math.min(Math.max(deltaX, -15), 15),
      rotateY: Math.min(Math.max(deltaY, -15), 15),
    };
  };

  // Calculate distance from spotlight for blur effect
  const getBlurAmount = (cardIndex) => {
    const distance = spotlightDistance?.[cardIndex] || 300;
    return Math.min(distance / 50, 20);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full perspective"
      style={{ perspective: '1200px' }}
    >
      {portfolioCards.map((card, index) => {
        const rotation = calculateRotation(card);
        const blur = getBlurAmount(index);
        const isInSpotlight = blur < 8;

        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className={`absolute ${card.position} w-60 h-40 sm:w-72 sm:h-48`}
            style={{
              transformStyle: 'preserve-3d',
              transform: `
                rotateX(${rotation.rotateX}deg)
                rotateY(${rotation.rotateY}deg)
                translateZ(${isInSpotlight ? 40 : 20}px)
              `,
              filter: `blur(${blur}px)`,
            }}
          >
            {/* Card Background Gradient */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.color} blur-xl opacity-60 -z-10`} />

            {/* Main Card */}
            <div
              className="relative h-full rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 shadow-2xl overflow-hidden group"
              style={{
                boxShadow: isInSpotlight
                  ? `0 0 40px rgba(var(--glow-color), 0.4)`
                  : `0 20px 40px rgba(0, 0, 0, 0.3)`,
              }}
            >
              {/* Gradient Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Shine Effect */}
              <motion.div
                className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"
                animate={{
                  top: '-30%',
                  left: '-30%',
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Card Content */}
              <div className="relative h-full flex flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white mb-3 backdrop-blur">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                    Featured
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-white/60">{card.description}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: [
                            'rgba(var(--accent-primary))',
                            'rgba(124, 141, 255)',
                            'rgba(255, 255, 255)',
                          ][i - 1],
                        }}
                      />
                    ))}
                  </div>
                  <FaArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
