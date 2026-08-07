import { useEffect, useRef, useState } from 'react';
import { ActionLayout, LoadingState, ResultState } from '../components/action/ActionLayout';
import { apiRequest } from '../lib/api';

export function NotificationSettingsPage() {
  const token = new URLSearchParams(window.location.search).get('u') ?? '';
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(Boolean(token));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(token ? '' : 'Open this page from the “Email preferences” link in a Sustena email.');
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) return;
    void apiRequest<{ marketingEmailsEnabled: boolean }>(`/auth/email-preferences?token=${encodeURIComponent(token)}`)
      .then((response) => setEnabled(response.marketingEmailsEnabled))
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const response = await apiRequest<{ marketingEmailsEnabled: boolean }>('/auth/email-preferences', {
        method: 'PUT',
        body: JSON.stringify({ token, marketingEmailsEnabled: enabled }),
      });
      setEnabled(response.marketingEmailsEnabled);
      setSaved(true);
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <ActionLayout eyebrow="Email preferences" title="Keep only what helps." description="Choose whether you’d like occasional Sustena product news, cooking ideas, and useful updates.">
      {loading && <LoadingState label="Loading your preferences…" />}
      {!loading && error && <ResultState kind="error" title="We couldn’t load this page." message={error} />}
      {!loading && !error && (
        <div className="preference-panel">
          <label className="preference-row">
            <span><strong>Ideas and product updates</strong><small>Occasional tips, recipes, and news from Sustena.</small></span>
            <input className="toggle-input" type="checkbox" checked={enabled} onChange={(event) => { setEnabled(event.target.checked); setSaved(false); }} />
          </label>
          <p className="field-hint">Security messages, verification emails, and password-reset emails are always sent when needed.</p>
          {saved && <p className="form-success" role="status">Your email preferences are saved.</p>}
          <button className="action-button" disabled={saving} type="button" onClick={save}>{saving ? 'Saving…' : 'Save preferences'}</button>
        </div>
      )}
    </ActionLayout>
  );
}
