import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

export default function ProjectCard({ project, isActive = true }) {
  return (
    <motion.article
      whileHover={isActive ? { y: -6 } : undefined}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`project-electric-card group relative flex h-full overflow-hidden rounded-2xl p-px shadow-[0_18px_48px_rgba(0,0,0,0.20)] outline-none transition duration-300 hover:shadow-[0_22px_70px_rgba(var(--glow-color),0.18)] ${
        isActive ? 'project-electric-card-active cursor-default' : 'cursor-pointer'
      }`}
      aria-hidden={!isActive}
    >
      <div className="absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(var(--glow-color),0.65),rgba(124,141,255,0.28),rgba(255,255,255,0.08))] opacity-70 transition duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--card-bg)] backdrop-blur-xl">
        <div className="relative h-[150px] overflow-hidden rounded-t-3xl border-b border-[var(--card-border)] sm:h-[220px]">
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-t-3xl object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-t-3xl bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.58)),radial-gradient(circle_at_82%_18%,rgba(var(--glow-color),0.24),transparent_30%)]" />
          <div className="absolute inset-0 rounded-t-3xl bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.10)_50%,transparent_100%)] opacity-60" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--text-primary)] backdrop-blur-md">
            Featured
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] sm:text-2xl md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-xs leading-relaxed text-[var(--text-muted)] sm:mt-3 sm:min-h-[4.5rem] sm:text-base">
            {project.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {project.stack.slice(0, 4).map((tech) => (
              <span key={tech} className="rounded-full border border-[var(--card-border)] bg-gradient-to-r from-white/10 to-white/5 px-2 py-1 text-[0.68rem] font-semibold text-[var(--text-primary)] backdrop-blur-sm transition hover:border-[var(--accent-primary)]/50 hover:bg-gradient-to-r hover:from-[var(--accent-primary)]/15 hover:to-[var(--accent-primary)]/5 sm:px-3 sm:py-1.5 sm:text-sm">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mt-5 sm:grid-cols-2 sm:gap-3">
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith('#') ? undefined : '_blank'}
              rel={project.liveUrl.startsWith('#') ? undefined : 'noreferrer'}
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] px-2 py-1.5 text-center text-[0.7rem] font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(var(--glow-color),0.26)] sm:min-h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                isActive ? '' : 'pointer-events-none'
              }`}
              tabIndex={isActive ? 0 : -1}
            >
              <FaExternalLinkAlt className="shrink-0" />
              <span>View Project</span>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[var(--card-border)] bg-white/5 px-2 py-1.5 text-center text-[0.7rem] font-bold text-[var(--text-primary)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--accent-primary)] hover:bg-white/10 sm:min-h-10 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm ${
                isActive ? '' : 'pointer-events-none'
              }`}
              tabIndex={isActive ? 0 : -1}
            >
              <FaGithub className="shrink-0" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
