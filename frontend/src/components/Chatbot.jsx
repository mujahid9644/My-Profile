import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { TbMessageChatbot } from 'react-icons/tb';
import { API_BASE_URL } from '../config/api.js';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi! I'm Mujahid's AI Assistant. Ask me about his projects, tech stack, services, or availability for work.",
    },
  ]);
  const [status, setStatus] = useState('Online');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = () => {
    setTimeout(scrollToBottom, 100);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const input = inputRef.current;
    const value = input.value.trim();
    if (!value || sending) return;

    setMessages((current) => [...current, { from: 'user', text: value }]);
    input.value = '';
    setSending(true);
    setStatus('Thinking...');
    handleNewMessage();

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value }),
      });
      const data = await res.json();

      if (!res.ok || data.error || !data.reply) {
        throw new Error(data.error || 'Service unavailable');
      }

      setMessages((current) => [...current, { from: 'bot', text: data.reply }]);
      setStatus(data.key_in_use ? `Using ${data.key_in_use}` : 'Online');
    } catch (error) {
      const isOffline = error.message.includes('Failed to fetch');
      setStatus(isOffline ? 'Offline' : 'Error');
      setMessages((current) => [
        ...current,
        {
          from: 'bot',
          text: isOffline
            ? 'Connection failed. Please check if the backend server is running.'
            : 'Sorry, I encountered an error. Please try again later.',
        },
      ]);
    } finally {
      setSending(false);
      handleNewMessage();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-2xl text-white shadow-lg transition-all duration-300 hover:shadow-[0_8px_32px_rgba(var(--glow-color),0.4)] md:bottom-8 md:right-8"
        aria-label="Toggle AI assistant"
      >
        {open ? <FaTimes /> : <TbMessageChatbot />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, scale: 0.92, y: 20, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20, x: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-3 z-50 flex h-[500px] w-[calc(100vw-1.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-[var(--card-border)]/50 bg-gradient-to-b from-[var(--bg-secondary)]/95 to-[var(--bg-primary)]/95 shadow-2xl backdrop-blur-xl sm:bottom-28 sm:right-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--card-border)]/40 bg-gradient-to-r from-[var(--bg-secondary)] to-transparent px-4 py-3.5">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-lg font-bold text-white"
                >
                  <TbMessageChatbot />
                </motion.div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">Mujahid AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-1.5 w-1.5 rounded-full bg-green-400"
                    />
                    <span className="text-sm text-[var(--text-muted)]">{status}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                aria-label="Close chatbot"
              >
                <FaTimes className="text-[var(--text-muted)]" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-gradient-to-b from-transparent via-[var(--bg-secondary)]/30 to-[var(--bg-primary)]/10 p-4 text-sm">
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.from}-${index}`}
                  initial={{ opacity: 0, y: 12, x: message.from === 'bot' ? -8 : 8 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.from === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 transition-all duration-200 ${
                      message.from === 'bot'
                        ? 'border border-[var(--card-border)]/50 bg-gradient-to-br from-white/8 to-white/5 text-[var(--text-primary)] hover:border-[var(--card-border)] hover:bg-white/12'
                        : 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl border border-[var(--card-border)]/50 bg-gradient-to-br from-white/8 to-white/5 px-4 py-3">
                    <span className="flex gap-1.5">
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 rounded-full bg-[var(--accent-primary)]"
                      />
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-[var(--accent-secondary)]"
                      />
                      <motion.span
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-[var(--text-muted)]"
                      />
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[var(--card-border)]/40 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent p-3.5">
              <input
                ref={inputRef}
                placeholder="Ask me something..."
                className="min-w-0 flex-1 rounded-lg border border-[var(--card-border)]/40 bg-white/6 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] backdrop-blur-sm transition-all hover:border-[var(--card-border)]/60 focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/50"
                disabled={sending}
              />
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg transition-all hover:shadow-[0_4px_16px_rgba(var(--glow-color),0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <FaPaperPlane className="text-xs" />
              </motion.button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
