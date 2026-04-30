import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaPaperPlane } from 'react-icons/fa';
import { RiWhatsappLine } from 'react-icons/ri';
import { API_BASE_URL } from '../config/api.js';
import AnimatedSection from './ui/AnimatedSection.jsx';
import GlowButton from './ui/GlowButton.jsx';

export default function Contact() {
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    setStatus({ type: 'info', message: 'Sending...' });
    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      let result = {};
      try {
        result = await res.json();
      } catch (_) {
        result = {};
      }

      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent - thank you!' });
        form.reset();
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send - please email directly.' });
      }
    } catch (_) {
      setStatus({ type: 'error', message: 'Network error - please email directly.' });
    } finally {
      setSending(false);
    }
  }

  const statusColor = {
    idle: { display: 'none' },
    info: { color: 'var(--accent-primary)' },
    success: { color: 'rgb(var(--success-color))' },
    error: { color: 'rgb(var(--danger-color))' },
  }[status.type];

  return (
    <AnimatedSection id="contact" className="section-shell py-24">
      <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/10 px-3 py-1.5 backdrop-blur-sm">
            <FaPaperPlane className="h-4 w-4 text-[var(--accent-primary)]" />
            <p className="text-base font-bold uppercase tracking-[.24em] text-[var(--accent-primary)]">Contact</p>
          </div>
          <h2 className="mt-3 text-4xl font-black text-[var(--text-primary)] sm:text-5xl">Let's build something useful.</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--text-muted)]">Need an AI chatbot, SaaS dashboard, automation system, or modern web app? Let's talk.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton as="a" variant="secondary" href="mailto:mujahidislam2540@gmail.com" className="rounded-md px-4 py-3"><FaEnvelope /> Email Me</GlowButton>
            <GlowButton as="a" variant="secondary" href="https://wa.me/8801537385580" target="_blank" rel="noreferrer" className="rounded-md px-4 py-3"><RiWhatsappLine /> WhatsApp</GlowButton>
            <GlowButton as="a" variant="secondary" href="https://github.com/mujahid9644" target="_blank" rel="noreferrer" className="rounded-md px-4 py-3"><FaGithub /> GitHub</GlowButton>
          </div>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="glass-panel rounded-2xl p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required name="name" placeholder="Your name" className="theme-input rounded-md px-4 py-3" />
            <input required name="email" placeholder="you@example.com" type="email" className="theme-input rounded-md px-4 py-3" />
          </div>
          <input required name="subject" placeholder="Project subject" className="theme-input mt-4 w-full rounded-md px-4 py-3" />
          <textarea required name="message" rows="6" placeholder="Tell me about the project..." className="theme-input mt-4 w-full resize-y rounded-md px-4 py-3" />
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-base" style={statusColor}>{status.message}</div>
            <button type="submit" disabled={sending} className="rounded-md px-6 py-3 text-base font-bold gradient-button disabled:cursor-not-allowed disabled:opacity-70">
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatedSection>
  );
}
