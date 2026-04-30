import { useEffect, useState } from 'react';
import { projects } from '../data/skills.js';
import { motion } from 'framer-motion';
import { FaBriefcase, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection.jsx';
import ProjectCard from './ui/ProjectCard.jsx';

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + projects.length) % projects.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % projects.length);
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
      rawOffset > projects.length / 2
        ? rawOffset - projects.length
        : rawOffset < -projects.length / 2
          ? rawOffset + projects.length
          : rawOffset;

    const positions = {
      '-1': {
        x: isMobile ? '-34vw' : '-45%',
        scale: isMobile ? 0.78 : 0.82,
        rotateY: isMobile ? 12 : 30,
        opacity: isMobile ? 0.45 : 0.46,
        zIndex: 2,
        filter: isMobile ? 'none' : 'brightness(0.58) blur(1.5px)',
      },
      0: {
        x: '0%',
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 5,
        filter: isMobile ? 'none' : 'brightness(1) blur(0px)',
      },
      1: {
        x: isMobile ? '34vw' : '45%',
        scale: isMobile ? 0.78 : 0.82,
        rotateY: isMobile ? -12 : -30,
        opacity: isMobile ? 0.45 : 0.46,
        zIndex: 2,
        filter: isMobile ? 'none' : 'brightness(0.58) blur(1.5px)',
      },
    };

    return positions[wrappedOffset] ?? {
      x: wrappedOffset < 0 ? '-58%' : '58%',
      scale: 0.72,
      rotateY: wrappedOffset < 0 ? 38 : -38,
      opacity: 0,
      zIndex: 1,
      filter: isMobile ? 'none' : 'brightness(0.42) blur(2px)',
    };
  };

  return (
    <AnimatedSection id="projects" className="border-y border-[var(--card-border)] pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaBriefcase className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">Featured Projects</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
            Real-world projects built with modern web and AI technologies.
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
            className="relative mx-auto h-[455px] max-w-5xl overflow-visible [perspective:1400px] sm:h-[560px] sm:overflow-hidden"
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
            {projects.map((project, index) => {
              const position = getPosition(index);
              const isActive = index === activeIndex;

              return (
                <motion.div
                  key={project.title}
                  className="absolute inset-x-0 top-2 mx-auto w-[70vw] max-w-[430px] sm:top-4 sm:w-[430px]"
                  animate={position}
                  transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  onClick={() => {
                    if (!isActive) {
                      setActiveIndex(index);
                    }
                  }}
                >
                  <ProjectCard project={project} isActive={isActive} />
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-0 flex items-center justify-center gap-3 sm:mt-2 sm:gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] text-[var(--text-primary)] shadow-lg backdrop-blur-xl transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] sm:h-11 sm:w-11"
              aria-label="Previous project"
            >
              <FaChevronLeft />
            </button>
            <div className="flex items-center gap-2">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-8 bg-[var(--accent-primary)]' : 'w-2.5 bg-white/25 hover:bg-white/45'
                  }`}
                  aria-label={`Show ${project.title}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] text-[var(--text-primary)] shadow-lg backdrop-blur-xl transition hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] sm:h-11 sm:w-11"
              aria-label="Next project"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
