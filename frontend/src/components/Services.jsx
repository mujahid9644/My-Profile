import { motion } from 'framer-motion';
import { FaChartBar, FaCubes, FaLaptopCode, FaMagic, FaPlug, FaRobot, FaSitemap } from 'react-icons/fa';
import AnimatedSection from './ui/AnimatedSection.jsx';

const services = [
  {
    title: 'AI Chatbots & LLM Integration',
    description: 'Conversation flows, RAG pipelines, and multi-provider fallback with production-ready API routing.',
    icon: FaRobot,
  },
  {
    title: 'SaaS Dashboards',
    description: 'Data-rich dashboards with authentication, roles, and clean analytics UX for teams and startups.',
    icon: FaChartBar,
  },
  {
    title: 'Business Automation Systems',
    description: 'Automated workflows for lead handling, reporting, and ops using APIs and custom scripts.',
    icon: FaSitemap,
  },
  {
    title: 'Full-Stack Web Applications',
    description: 'End-to-end web apps with Django, React, and PostgreSQL built for scale and performance.',
    icon: FaLaptopCode,
  },
  {
    title: 'API Integration',
    description: 'Secure API integrations for payments, CRMs, communication tools, and third-party data.',
    icon: FaPlug,
  },
  {
    title: 'Portfolio & Business Websites',
    description: 'Fast, responsive sites with modern UI, SEO, and conversion-focused layouts.',
    icon: FaCubes,
  },
];

export default function Services() {
  return (
    <AnimatedSection id="services" className="border-y border-[var(--card-border)] py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaMagic className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">What I Build</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">Services focused on AI-first product delivery.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group premium-card rounded-2xl p-6 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 text-2xl text-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/10 backdrop-blur-xl transition group-hover:scale-110 group-hover:shadow-[var(--accent-primary)]/20">
                    <Icon />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">{service.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">{service.description}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
