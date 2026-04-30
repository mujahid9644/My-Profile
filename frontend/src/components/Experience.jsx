import { motion } from 'framer-motion';
import { FaBolt, FaCheckCircle } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection.jsx';

const milestones = [
  {
    title: 'Full-Stack + AI Focus',
    period: '2023 - Present',
    detail: 'Building SaaS workflows, AI assistants, and automation tools with Django, React, and LLM APIs.',
  },
  {
    title: 'Product Delivery & Freelance Builds',
    period: '2024-2025',
    detail: 'Delivered portfolio sites, business websites, and custom dashboards for client-ready launches.',
  },
  {
    title: 'Core Engineering Foundations',
    period: '2023 - 2026',
    detail: 'Strengthened Python, web fundamentals, database design, and deployment practices.',
  },
];

export default function Experience() {
  return (
    <AnimatedSection id="experience" className="border-y border-[var(--card-border)] py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaBolt className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">Experience</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">Learning journey focused on real-world product delivery.</h2>
        </div>
        <div className="mt-10 grid gap-5">
          {milestones.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group premium-card rounded-2xl p-6 transition hover:border-[var(--accent-primary)]/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[var(--accent-primary)]/20">
                  <FaCheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">{item.title}</h3>
                    <span className="text-sm font-semibold uppercase tracking-[.24em] text-[var(--text-muted)]">{item.period}</span>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-[var(--text-muted)]">{item.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
