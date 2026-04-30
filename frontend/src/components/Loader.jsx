import { motion } from 'framer-motion';

const letters = 'MUJAHID'.split('');

const particles = Array.from({ length: 22 }, (_, index) => {
  const angle = (index / 22) * Math.PI * 2;
  const distance = 72 + (index % 4) * 24;

  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: index % 5 === 0 ? 5 : 3,
  };
});

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020409] text-[var(--text-primary)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--glow-color),0.16),transparent_22rem),radial-gradient(circle_at_50%_30%,rgba(124,141,255,0.12),transparent_24rem),linear-gradient(145deg,#020409,var(--bg-primary)_48%,#030712)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(var(--glow-color),.08)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--glow-color),.08)_1px,transparent_1px)] [background-size:58px_58px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />

      <div className="relative flex h-80 w-full max-w-xl items-center justify-center px-6 sm:h-96">
        <motion.div
          initial={{ y: '-52vh', opacity: 0 }}
          animate={{ y: ['-52vh', '-52vh', 0, 0], opacity: [0, 1, 1, 0.55] }}
          transition={{ duration: 2.15, times: [0, 0.12, 0.68, 1], ease: 'easeInOut' }}
          className="absolute top-1/2 h-28 w-1 -translate-y-full rounded-full bg-[linear-gradient(180deg,transparent,var(--accent-primary),white)] shadow-[0_0_28px_rgba(var(--glow-color),0.95)]"
        />

        <motion.div
          initial={{ y: '52vh', opacity: 0 }}
          animate={{ y: ['52vh', '52vh', 0, 0], opacity: [0, 1, 1, 0.55] }}
          transition={{ duration: 2.15, times: [0, 0.12, 0.68, 1], ease: 'easeInOut' }}
          className="absolute bottom-1/2 h-28 w-1 translate-y-full rounded-full bg-[linear-gradient(0deg,transparent,var(--accent-secondary),white)] shadow-[0_0_28px_rgba(124,141,255,0.9)]"
        />

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 0, 1, 1.08, 0.45], opacity: [0, 0, 0.95, 0.75, 0] }}
          transition={{ duration: 3.05, times: [0, 0.48, 0.6, 0.76, 1], ease: 'easeInOut' }}
          className="absolute h-px w-72 max-w-[72vw] bg-[linear-gradient(90deg,transparent,var(--accent-primary),white,var(--accent-secondary),transparent)] shadow-[0_0_28px_rgba(var(--glow-color),0.9)]"
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 0, 1, 1.55, 2.05], opacity: [0, 0, 0.75, 0.4, 0] }}
          transition={{ duration: 3.1, times: [0, 0.58, 0.66, 0.78, 1], ease: 'easeOut' }}
          className="absolute h-32 w-32 rounded-full border border-[rgba(var(--glow-color),0.7)] shadow-[0_0_70px_rgba(var(--glow-color),0.45),inset_0_0_32px_rgba(var(--glow-color),0.22)]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(14px)' }}
          animate={{ opacity: [0, 0, 1, 1, 0.88], scale: [0.92, 0.92, 1, 1.04, 1.02], filter: ['blur(14px)', 'blur(14px)', 'blur(0px)', 'blur(0px)', 'blur(2px)'] }}
          transition={{ duration: 3.15, times: [0, 0.42, 0.6, 0.82, 1], ease: 'easeInOut' }}
          className="relative z-10 flex items-center justify-center gap-1 sm:gap-2"
          aria-label="MUJAHID"
        >
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ opacity: 0, y: 18, scale: 0.78, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 1.18 + index * 0.075, duration: 0.48, ease: 'easeOut' }}
              className="text-5xl font-black leading-none tracking-[0.08em] text-transparent bg-clip-text bg-[linear-gradient(120deg,#ffffff,var(--accent-primary),var(--accent-secondary))] drop-shadow-[0_0_18px_rgba(var(--glow-color),0.75)] sm:text-7xl md:text-8xl"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.35 }}
          animate={{ opacity: [0, 0, 0.92, 0], scale: [0.35, 0.35, 1.08, 1.65] }}
          transition={{ duration: 2.9, times: [0, 0.62, 0.72, 1], ease: 'easeOut' }}
          className="absolute h-40 w-40 rounded-full bg-[rgba(var(--glow-color),0.24)] blur-2xl"
        />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, 0, particle.x],
              y: [0, 0, particle.y],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{ duration: 1.1, delay: 2.22, ease: 'easeOut' }}
            className="absolute rounded-full bg-white shadow-[0_0_18px_rgba(var(--glow-color),0.95)]"
            style={{ height: particle.size, width: particle.size }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.85, 0] }}
          transition={{ duration: 3, times: [0, 0.68, 0.73, 1], ease: 'easeOut' }}
          className="absolute inset-[-25vh] bg-white mix-blend-screen"
        />
      </div>
    </motion.div>
  );
}
