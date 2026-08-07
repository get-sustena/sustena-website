import { useState, type FormEvent } from 'react';
import { ActionLayout, ResultState } from '../components/action/ActionLayout';
import { apiRequest } from '../lib/api';

type Step = 'code' | 'password' | 'done';

export function ResetPasswordPage() {
  const queryCode = new URLSearchParams(window.location.search).get('code') ?? '';
  const [step, setStep] = useState<Step>('code');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(queryCode);
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    if (!email.includes('@') || !/^\d{6}$/.test(code)) {
      setError('Enter your email address and the 6-digit code from your email.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest<{ resetToken: string }>('/auth/verify-reset-code', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), code }),
      });
      setResetToken(response.resetToken);
      setStep('password');
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword: password }),
      });
      setStep('done');
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ActionLayout
      eyebrow="Password reset"
      title={step === 'done' ? 'You’re back in control.' : 'Choose a fresh password.'}
      description={step === 'code'
        ? 'Confirm the reset code we sent you. It remains valid for 15 minutes.'
        : step === 'password'
          ? 'Make it memorable for you and difficult for anyone else to guess.'
          : 'Your password has been changed securely. You can now sign in with the new one.'}
    >
      {step === 'code' && (
        <form className="action-form" onSubmit={verifyCode}>
          <label>Email address<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
          <label>6-digit reset code<input className="code-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="action-button" disabled={loading} type="submit">{loading ? 'Checking code…' : 'Continue'}</button>
        </form>
      )}
      {step === 'password' && (
        <form className="action-form" onSubmit={changePassword}>
          <label>New password<input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          <label>Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
          <p className="field-hint">At least 8 characters. A mix of words, numbers, and symbols is strongest.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="action-button" disabled={loading} type="submit">{loading ? 'Changing password…' : 'Change password'}</button>
        </form>
      )}
      {step === 'done' && (
        <ResultState kind="success" title="Password changed." message="Your other signed-in sessions have also been closed for safety.">
          <a className="action-button" href="/">Return to Sustena</a>
        </ResultState>
      )}
    </ActionLayout>
  );
}
