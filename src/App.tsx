import { lazy, Suspense } from 'react';
import { HelpPage, PrivacyPage } from './pages/InfoPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UnsubscribePage } from './pages/UnsubscribePage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

// Loaded on its own so its styles never reach the account pages above.
const Landing = lazy(() => import('./components/landing/Landing'));

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/verify') return <VerifyEmailPage />;
  if (path === '/reset') return <ResetPasswordPage />;
  if (path === '/unsubscribe') return <UnsubscribePage />;
  if (path === '/settings/notifications') return <NotificationSettingsPage />;
  if (path === '/help') return <HelpPage />;
  if (path === '/privacy') return <PrivacyPage />;

  return (
    <Suspense fallback={null}>
      <Landing />
    </Suspense>
  );
}

export default App;
