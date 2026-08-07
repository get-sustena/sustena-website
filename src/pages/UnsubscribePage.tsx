import { useEffect, useRef, useState } from 'react';
import { ActionLayout, LoadingState, ResultState } from '../components/action/ActionLayout';
import { apiRequest } from '../lib/api';

type ViewState = 'loading' | 'success' | 'error';

export function UnsubscribePage() {
  const token = new URLSearchParams(window.location.search).get('u');
  const [state, setState] = useState<ViewState>(token ? 'loading' : 'error');
  const [error, setError] = useState(token ? '' : 'This unsubscribe link is incomplete. Please use the link from your Sustena email.');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) return;
    void apiRequest('/auth/unsubscribe', { method: 'POST', body: JSON.stringify({ token }) })
      .then(() => setState('success'))
      .catch((requestError: Error) => {
        setError(requestError.message);
        setState('error');
      });
  }, [token]);

  return (
    <ActionLayout eyebrow="Email preferences" title="Your inbox, your choice." description="We only want to send messages that are useful to you.">
      {state === 'loading' && <LoadingState label="Updating your preferences…" />}
      {state === 'success' && (
        <ResultState kind="success" title="You’re unsubscribed." message="You won’t receive optional Sustena updates. Essential account and security emails will still arrive.">
          <a className="action-button action-button-secondary" href={`/settings/notifications${window.location.search}`}>Change preferences</a>
        </ResultState>
      )}
      {state === 'error' && <ResultState kind="error" title="We couldn’t update your preference." message={error} />}
    </ActionLayout>
  );
}
