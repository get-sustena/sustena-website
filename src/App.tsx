import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Problem } from './components/Problem';
import { Solution } from './components/Solution';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { WhyJoin } from './components/WhyJoin';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';

function App() {
  return (
    <>
      <Nav />
      <main>
        {/* Visually hidden but crawlable/screen-reader-visible primary heading. The Hero's
            big "What should I cook today?" text is the visual centerpiece but fades in
            through a scroll-driven animation — this gives search engines and assistive tech
            a stable, always-present h1 without touching that animation. */}
        <h1 className="sr-only">Sustena — budget-first meal planning, pantry mode, and step-by-step cooking guidance for Nigerian kitchens</h1>
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
