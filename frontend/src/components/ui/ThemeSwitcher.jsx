import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../theme/ThemeProvider.jsx';

export default function ThemeSwitcher({ compact = false }) {
  const { theme, themes, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[color:var(--accent-primary)] ${compact ? 'w-full justify-between' : ''}`}
        aria-expanded={open}
      >
        <span>{theme.name}</span>
        <FaChevronDown className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-56 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[color:var(--bg-secondary)]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {themes.map((option) => {
            const active = option.id === theme.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className={`flex w-full flex-col gap-1 rounded-xl px-3 py-3 text-left transition ${active ? 'bg-[color:var(--card-bg)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-primary)]'}`}
              >
                <span className="text-sm font-semibold">{option.name}</span>
                <span className="text-xs leading-5">{option.description}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
