import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import GlowButton from './GlowButton.jsx';

function DetailCard({ title, children, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.08 * index }}
      className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[color:var(--card-bg)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.16)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--glow-color),0.12),transparent_55%)]" />
      <div className="relative space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">{title}</p>
        {children}
      </div>
    </motion.div>
  );
}

export default function ProjectDetailsPanel({ project, onClose }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <DetailCard title="Tech Stack" index={0}>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span key={item} className="rounded-full border border-[var(--card-border)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]">
              {item}
            </span>
          ))}
        </div>
      </DetailCard>

      <DetailCard title="Features" index={1}>
        <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
          {project.features.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-primary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DetailCard>

      <DetailCard title="Challenges Solved" index={2}>
        <ul className="space-y-2 text-sm leading-6 text-[var(--text-muted)]">
          {project.challenges.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-secondary)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </DetailCard>

      <DetailCard title="Live / GitHub" index={3}>
        <div className="flex flex-col gap-3">
          <GlowButton as="a" href={project.liveUrl} target="_blank" rel="noreferrer" className="w-full justify-center text-sm">
            <FaExternalLinkAlt /> Live Preview
          </GlowButton>
          <GlowButton as="a" variant="secondary" href={project.githubUrl} target="_blank" rel="noreferrer" className="w-full justify-center text-sm">
            <FaGithub /> GitHub
          </GlowButton>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-[var(--card-border)] px-5 py-3 text-sm font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
          >
            Close Details
          </button>
        </div>
      </DetailCard>
    </div>
  );
}
