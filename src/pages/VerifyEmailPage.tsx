import { useEffect, useRef, useState } from 'react';
import { ActionLayout, LoadingState, ResultState } from '../components/action/ActionLayout';
import { apiRequest } from '../lib/api';

type ViewState = 'loading' | 'success' | 'already-verified' | 'error';

export function VerifyEmailPage() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [state, setState] = useState<ViewState>(token ? 'loading' : 'error');
  const [error, setError] = useState(token ? '' : 'This verification link is incomplete. Open the latest welcome email and try again.');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) return;

    void apiRequest<{ alreadyVerified: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then((response) => setState(response.alreadyVerified ? 'already-verified' : 'success'))
      .catch((requestError: Error) => {
        setError(requestError.message);
        setState('error');
      });
  }, [token]);

  return (
    <ActionLayout
      eyebrow="Email confirmation"
      title="One small step."
      description="We’re confirming that this email belongs to you, then your Sustena account is ready."
    >
      {state === 'loading' && <LoadingState label="Confirming your email…" />}
      {state === 'success' && (
        <ResultState kind="success" title="You’re verified." message="Your email is confirmed and your Sustena account is ready to use.">
          <a className="action-button" href="/">Explore Sustena</a>
        </ResultState>
      )}
      {state === 'already-verified' && (
        <ResultState kind="success" title="Already confirmed." message="This email was verified earlier. There’s nothing else you need to do.">
          <a className="action-button" href="/">Back to Sustena</a>
        </ResultState>
      )}
      {state === 'error' && (
        <ResultState kind="error" title="We couldn’t verify this link." message={error}>
          <a className="action-button action-button-secondary" href="mailto:support@getsustena.com">Contact support</a>
        </ResultState>
      )}
    </ActionLayout>
  );
}
