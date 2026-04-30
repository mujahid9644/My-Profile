import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';

const socials = [
  { icon: FaGithub, href: 'https://github.com/mujahid9644', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/al-mujahid-ali-2b27053b7/', label: 'LinkedIn' },
  { icon: FaFacebook, href: 'https://www.facebook.com/mujahid.islam.18698', label: 'Facebook' },
];

export default function FloatingSocials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pointer-events-none fixed left-2 top-[62%] z-[9999] flex -translate-y-1/2 flex-col gap-3 sm:left-6 sm:top-1/2 sm:gap-4"
      aria-label="Social links"
    >
      {socials.map(({ icon: Icon, href, label }) => (
        <motion.a
          key={label}
          variants={itemVariants}
          href={href}
          target={href === '#' ? undefined : '_blank'}
          rel={href === '#' ? undefined : 'noreferrer'}
          aria-label={label}
          whileHover={{ scale: 1.1 }}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 shadow-lg backdrop-blur-xl transition duration-300 hover:scale-110 hover:bg-white/20 sm:h-12 sm:w-12"
        >
          <Icon className="text-sm sm:text-lg" />
        </motion.a>
      ))}
    </motion.div>
  );
}
