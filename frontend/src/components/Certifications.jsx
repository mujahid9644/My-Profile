import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaChevronLeft, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection.jsx';

const certifications = [
  {
    title: 'AI-Powered UI/UX Design: Figma AI, Claude & Nano-Banana',
    issuer: 'Ostad',
    imageUrl:
      '/OstadUIUX.PNG',
    certificateUrl: 'https://ostad.app/share/certificate/c42482-mujahid',
  },
  {
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    imageUrl:
      'rwdfree.png',
    certificateUrl: 'https://www.freecodecamp.org/certification/mujahid9644/responsive-web-design',
  },
  {
    title: 'AI Automation',
    issuer: 'Professional Training',
    imageUrl:
      'ai_automation.png',
    certificateUrl: 'https://ostad.app/share/certificate/c42484-mujahid',
  },
];

export default function Certifications() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + certifications.length) % certifications.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % certifications.length);
  };

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    const interval = window.setInterval(goToNext, 4200);
    return () => window.clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);

    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  const getPosition = (index) => {
    const rawOffset = index - activeIndex;
    const wrappedOffset =
      rawOffset > certifications.length / 2
        ? rawOffset - certifications.length
        : rawOffset < -certifications.length / 2
          ? rawOffset + certifications.length
          : rawOffset;

    const positions = {
      '-1': {
        x: isMobile ? '-36vw' : '-48%',
        scale: isMobile ? 0.78 : 0.82,
        rotateY: isMobile ? 10 : 26,
        opacity: isMobile ? 0.42 : 0.48,
        zIndex: 2,
        filter: isMobile ? 'none' : 'brightness(0.62) blur(1px)',
      },
      0: {
        x: '0%',
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 5,
        filter: 'brightness(1) blur(0px)',
      },
      1: {
        x: isMobile ? '36vw' : '48%',
        scale: isMobile ? 0.78 : 0.82,
        rotateY: isMobile ? -10 : -26,
        opacity: isMobile ? 0.42 : 0.48,
        zIndex: 2,
        filter: isMobile ? 'none' : 'brightness(0.62) blur(1px)',
      },
    };

    return positions[wrappedOffset] ?? {
      x: wrappedOffset < 0 ? '-58%' : '58%',
      scale: 0.72,
      rotateY: wrappedOffset < 0 ? 34 : -34,
      opacity: 0,
      zIndex: 1,
      filter: isMobile ? 'none' : 'brightness(0.42) blur(2px)',
    };
  };

  return (
    <AnimatedSection id="certifications" className="border-y border-[var(--card-border)] py-12 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaCertificate className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">Certifications</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">
            Professional Certifications
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
            Verified learning milestones from hands-on courses and professional training.
          </p>
        </div>

        <div
          className="relative mt-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent sm:block" />

          <motion.div
            className="relative mx-auto h-[410px] max-w-5xl overflow-visible [perspective:1400px] sm:h-[430px] sm:overflow-hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setPaused(true)}
            onDragEnd={(_, info) => {
              setPaused(false);
              if (info.offset.x < -70) {
                goToNext();
              } else if (info.offset.x > 70) {
                goToPrevious();
              }
            }}
          >
            {certifications.map((certificate, index) => {
              const position = getPosition(index);
              const isActive = index === activeIndex;
              const isLongTitle = certificate.title.length > 45;

              return (
                <motion.div
                  key={certificate.title}
                  className="absolute inset-x-0 top-2 mx-auto w-[76vw] max-w-[500px] sm:top-3 sm:w-[420px] sm:max-w-[420px]"
                  animate={position}
                  transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <motion.article
                    whileHover={isActive ? { y: -6 } : undefined}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className={`project-electric-card group relative overflow-hidden rounded-2xl p-px shadow-[0_18px_48px_rgba(0,0,0,0.20)] transition duration-300 hover:shadow-[0_22px_70px_rgba(var(--glow-color),0.18)] ${
                      isActive ? 'project-electric-card-active cursor-default' : 'cursor-pointer'
                    }`}
                    aria-hidden={!isActive}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(var(--glow-color),0.65),rgba(124,141,255,0.28),rgba(255,255,255,0.08))] opacity-70 transition duration-300 group-hover:opacity-100" />

                    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--card-bg)] backdrop-blur-xl">
                      <div
                        className={`relative aspect-[1.414/1] overflow-hidden border-b border-[var(--card-border)] bg-white ${
                          isLongTitle ? 'sm:aspect-[1.55/1]' : ''
                        }`}
                      >
                        <img
                          src={certificate.imageUrl}
                          alt={certificate.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(var(--glow-color),0.16),transparent_34%)]" />
                        <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-md sm:left-4 sm:top-4">
                          Certificate
                        </div>
                      </div>

                      <div
                        className={`flex min-h-[118px] flex-col gap-3 p-4 ${
                          isLongTitle ? 'sm:min-h-[96px] sm:gap-2 sm:p-3' : 'sm:min-h-[104px] sm:gap-2.5 sm:p-4'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-primary)]">
                            {certificate.issuer}
                          </p>
                          <h3
                            className={`mt-1 line-clamp-2 font-black leading-tight text-[var(--text-primary)] ${
                              isLongTitle ? 'text-xl sm:text-lg' : 'text-xl'
                            }`}
                          >
                            {certificate.title}
                          </h3>
                        </div>

                        <a
                          href={certificate.certificateUrl}
                          target={certificate.certificateUrl.startsWith('#') ? undefined : '_blank'}
                          rel={certificate.certificateUrl.startsWith('#') ? undefined : 'noreferrer'}
                          className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(var(--glow-color),0.26)] sm:text-xs ${
                            isActive ? '' : 'pointer-events-none'
                          } ${isLongTitle ? 'sm:min-h-8 sm:py-1' : 'sm:min-h-9 sm:py-1.5'}`}
                          tabIndex={isActive ? 0 : -1}
                        >
                          <FaExternalLinkAlt className="shrink-0" />
                          <span>View Certificate</span>
                        </a>
                      </div>
                    </div>
                  </motion.article>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-0 flex items-center justify-center gap-3 sm:mt-2 sm:gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] text-[var(--text-primary)] shadow-lg backdrop-blur-xl transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] sm:h-11 sm:w-11"
              aria-label="Previous certificate"
            >
              <FaChevronLeft />
            </button>
            <div className="flex items-center gap-2">
              {certifications.map((certificate, index) => (
                <button
                  key={certificate.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-8 bg-[var(--accent-primary)]' : 'w-2.5 bg-white/25 hover:bg-white/45'
                  }`}
                  aria-label={`Show ${certificate.title}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] text-[var(--text-primary)] shadow-lg backdrop-blur-xl transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] sm:h-11 sm:w-11"
              aria-label="Next certificate"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
