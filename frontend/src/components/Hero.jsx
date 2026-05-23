import { motion } from 'framer-motion';
import { FaBolt } from 'react-icons/fa';
import { useTheme } from '../theme/ThemeProvider.jsx';
import GlowButton from './ui/GlowButton.jsx';

const heroImages = {
  'cyber-blue': '/hero.jpg',
  'purple-luxury': '/herop.png',
  'emerald-tech': '/herog.png',
};

export default function Hero() {
  const { theme } = useTheme();
  const heroImage = heroImages[theme.id] ?? heroImages['cyber-blue'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <header
      id="home"
      className="relative w-full overflow-hidden md:min-h-[85vh]"
      aria-label="Portfolio hero"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="section-shell flex h-full items-center justify-center py-10 md:py-12"
      >
        {/* Main Grid Layout - 70/30 */}
        <div className="grid w-full gap-7 md:grid-cols-[70%_30%] md:gap-12">
          {/* Left Side - Image (70%) */}
          <motion.div
            variants={itemVariants}
            className="order-1 flex items-center justify-center"
          >
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl shadow-cyan-500/10">
              <img
                src={heroImage}
                alt="Mujahid Islam - Developer"
                className="h-auto max-h-[52vh] w-full object-contain md:max-h-[650px]"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </motion.div>

          {/* Right Side - Content (30%) */}
          <motion.div
            variants={itemVariants}
            className="order-2 flex flex-col justify-center gap-4 md:gap-6"
          >
            {/* Greeting */}
            <div>
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm"
              >
                <FaBolt className="h-4 w-4 text-[var(--accent-primary)]" />
                <p className="text-sm font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
                  Welcome to my portfolio
                </p>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="mt-2 text-3xl font-black leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl"
              >
                Ammazing <span className="text-[var(--accent-primary)]">Experience</span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base font-bold text-[var(--text-primary)] md:text-lg"
            >
              Let's build something great together.
            </motion.p>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm leading-relaxed text-[var(--text-muted)] md:text-base"
            >
              You want websites, SaaS dashboards, chatbots ! 
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <GlowButton as="a" href="#projects" className="px-4 py-2 text-sm sm:px-6 sm:text-base">
                View Projects
              </GlowButton>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 sm:px-6 sm:text-base"
              >
                Contact Me
              </button>
            </motion.div>

          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
