import type { ReactNode } from 'react';
import logoGreen from '../../assets/images/logo/resolved-line-green.svg';
import { LogoImage } from '../icons/LogoImage';

interface ActionLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function ActionLayout({ eyebrow, title, description, children }: ActionLayoutProps) {
  return (
    <main className="action-page">
      <div className="action-glow action-glow-left" />
      <div className="action-glow action-glow-right" />
      <section className="action-shell" aria-labelledby="action-title">
        <a className="action-brand" href="/" aria-label="Sustena home">
          <LogoImage src={logoGreen} h={28} />
          <span>Sustena</span>
        </a>
        <div className="action-rule" />
        <p className="action-eyebrow">{eyebrow}</p>
        <h1 id="action-title">{title}</h1>
        <p className="action-description">{description}</p>
        <div className="action-content">{children}</div>
        <footer className="action-footer">
          <span>Thoughtful food choices, made easier.</span>
          <span aria-hidden="true">•</span>
          <a href="mailto:support@getsustena.com">Need help?</a>
        </footer>
      </section>
    </main>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="status-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <strong>{label}</strong>
      <p>Please keep this page open for a moment.</p>
    </div>
  );
}

interface ResultStateProps {
  kind: 'success' | 'error';
  title: string;
  message: string;
  children?: ReactNode;
}

export function ResultState({ kind, title, message, children }: ResultStateProps) {
  return (
    <div className={`status-panel status-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="status-icon" aria-hidden="true">{kind === 'success' ? '✓' : '!'}</span>
      <strong>{title}</strong>
      <p>{message}</p>
      {children}
    </div>
  );
}
