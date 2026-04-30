import { motion } from 'framer-motion';
import AnimatedSection from './ui/AnimatedSection.jsx';

const stackGroups = [
  {
    title: 'Frontend',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
  },
  {
    title: 'Backend',
    items: ['Python', 'Flask', 'Django', 'Django REST Framework', 'PostgreSQL'],
  },
  {
    title: 'AI / LLM',
    items: ['LangChain', 'OpenAI API', 'Gemini API', 'Groq API', 'Prompt Engineering'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'VS Code', 'Render', 'Vercel', 'Postman'],
  },
];

export default function TechStack() {
  return (
    <AnimatedSection id="stack" className="border-y border-[var(--card-border)] py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">Tech Stack</p>
          <h2 className="mt-3 text-3xl font-black text-[var(--text-primary)] sm:text-4xl">Tools and frameworks used across AI products.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {stackGroups.map((group, index) => (
            <motion.article
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="premium-card rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{group.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="soft-chip">
                    {item}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
