import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <AnimatedSection as="footer" className="border-t border-[var(--card-border)] py-8">
      <div className="section-shell flex flex-col items-center justify-between gap-5 text-[var(--text-muted)] md:flex-row">
        <p>&copy; {year} Al Mujahid. All rights reserved.</p>
        <div className="flex gap-3">
          {[
            { Icon: FaGithub, href: 'https://github.com/mujahid9644', label: 'GitHub' },
            { Icon: FaLinkedin, href: 'https://www.linkedin.com/in/al-mujahid-ali-2b27053b7/', label: 'LinkedIn' },
            { Icon: FaFacebook, href: 'https://www.facebook.com/mujahid.islam.18698', label: 'Facebook' },
            { Icon: FaInstagram, href: 'https://www.instagram.com/ftv.mjd', label: 'Instagram' },
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.1, y: -2 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--card-border)] bg-white/5 text-[var(--text-muted)] transition duration-300 hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] backdrop-blur-sm"
            >
              <Icon className="text-lg" />
            </motion.a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
