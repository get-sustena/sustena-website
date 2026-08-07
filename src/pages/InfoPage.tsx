import { ActionLayout } from '../components/action/ActionLayout';

export function HelpPage() {
  return (
    <ActionLayout eyebrow="Help" title="A real person can help." description="Questions about your account, a recipe, or something that doesn’t look right? Tell us what happened.">
      <div className="info-panel"><p>Email our support team and include the address connected to your Sustena account.</p><a className="action-button" href="mailto:support@getsustena.com">Email support</a></div>
    </ActionLayout>
  );
}

export function PrivacyPage() {
  return (
    <ActionLayout eyebrow="Privacy" title="Your information deserves care." description="Sustena uses account information to provide meal-planning, pantry, shopping, and security features.">
      <div className="info-panel"><p>We do not use password-reset or verification details for marketing. You can control optional emails at any time from the preference link in a Sustena email.</p><p>For privacy requests, data-access questions, or account deletion support, contact us directly.</p><a className="action-button action-button-secondary" href="mailto:support@getsustena.com?subject=Privacy%20request">Send a privacy request</a></div>
    </ActionLayout>
  );
}
