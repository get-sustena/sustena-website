import '../../styles/landing.css';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ScrollTrigger } from '../../lib/gsap';
import { Header } from './Header';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Kitchen } from './Kitchen';
import { Questions } from './Questions';
import { Footer } from './Footer';

export default function Landing() {
  // Web fonts change line lengths, and with them where each scroll effect starts and ends.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="landing">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Kitchen />
        <Questions />
      </main>
      <Footer />
      {/* Only on this page: the account pages carry private codes in their addresses. */}
      <Analytics />
    </div>
  );
}
