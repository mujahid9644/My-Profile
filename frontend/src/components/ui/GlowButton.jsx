export default function GlowButton({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) {
  const baseClassName =
    variant === 'secondary'
      ? 'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[color:var(--card-bg)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent-primary)] hover:shadow-[0_18px_50px_rgba(var(--glow-color),0.18)]'
      : 'inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(var(--glow-color),0.32)]';

  return (
    <Component className={`${baseClassName} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
