import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RiWhatsappLine } from 'react-icons/ri';
import GlowButton from './ui/GlowButton.jsx';
import ThemeSwitcher from './ui/ThemeSwitcher.jsx';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = window.scrollY > 16;

    setScrolled(lastScrolled);

    const updateScrolled = () => {
      const nextScrolled = window.scrollY > 16;

      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`fixed inset-x-0 top-0 z-40 border-b transition duration-300 ${
        scrolled ? 'border-[var(--card-border)] bg-[color:var(--card-bg)] shadow-xl backdrop-blur-xl' : 'border-transparent bg-transparent backdrop-blur-md'
      }`}
    >
      <div className="section-shell flex items-center justify-between py-3">
        <a href="#home" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="h-11 w-11 overflow-hidden rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)]">
            <img src="/protfolio.jpg" alt="Mujahid Islam" className="h-full w-full object-cover" loading="eager" decoding="async" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black leading-tight text-[var(--text-primary)]">Al Mujahid</span>
            <span className="block truncate text-sm text-[var(--text-muted)]">Your web partner</span>
          </span>
        </a>

        <div className="hidden items-center gap-5 text-base font-semibold text-[var(--text-muted)] md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[var(--accent-primary)]">
              {link.label}
            </a>
          ))}
          <ThemeSwitcher />
          <a
            href="https://wa.me/8801533827434"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-2 font-semibold text-green-400 transition-all hover:border-green-400 hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <RiWhatsappLine className="text-lg" />
            WhatsApp Me
          </a>
          <GlowButton as="a" href="#contact" className="px-4 py-2">
            Hire Me
          </GlowButton>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--card-border)] text-[var(--text-primary)] md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[var(--card-border)] bg-[color:var(--bg-secondary)]/95 px-4 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <div className="pb-2">
              <ThemeSwitcher compact />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 transition hover:bg-white/5 hover:text-[var(--accent-primary)]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/8801533827434"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 font-semibold text-green-400 transition-all hover:border-green-400 hover:bg-green-500/20"
            >
              <RiWhatsappLine className="text-lg" />
              WhatsApp Me
            </a>
            <GlowButton as="a" href="#contact" className="mt-2 w-full justify-center px-4 py-3">
              Hire Me
            </GlowButton>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
