import { motion } from 'framer-motion';
import { FaBullseye } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection.jsx';

export default function About() {
  return (
    <AnimatedSection id="about" className="border-y border-[var(--card-border)] py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaBullseye className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">About</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">Building practical AI-powered products, not just websites.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--text-muted)]">
            I’m Mujahid Islam, a full-stack developer focused on building modern web apps, SaaS dashboards, automation tools, and LLM-powered chatbot systems.
            I work with Django, React, PostgreSQL, Tailwind CSS, and AI APIs to build client-ready digital products.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="premium-card rounded-2xl p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'AI Chatbots & LLM Integration',
              'SaaS Dashboards',
              'Business Automation Systems',
              'Full-Stack Web Applications',
            ].map((item) => (
              <div key={item} className="group rounded-xl border border-[var(--card-border)] bg-white/5 p-4 text-base font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)]/50 hover:bg-white/10 hover:shadow-lg hover:shadow-[var(--accent-primary)]/10">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
