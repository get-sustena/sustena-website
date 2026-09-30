import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { WhyJoin } from './components/WhyJoin';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { HelpPage, PrivacyPage } from './pages/InfoPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { UnsubscribePage } from './pages/UnsubscribePage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/verify') return <VerifyEmailPage />;
  if (path === '/reset') return <ResetPasswordPage />;
  if (path === '/unsubscribe') return <UnsubscribePage />;
  if (path === '/settings/notifications') return <NotificationSettingsPage />;
  if (path === '/help') return <HelpPage />;
  if (path === '/privacy') return <PrivacyPage />;

  return (
    <>
      <Nav />
      <main>
        <h1 className="sr-only">Sustena: budget-first meal planning, pantry mode, and step-by-step cooking guidance for Nigerian kitchens</h1>
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Features />
        <WhyJoin />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  );
}

export default App;
