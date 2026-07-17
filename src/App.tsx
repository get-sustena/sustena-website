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
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Features />
      <WhyJoin />
      <FAQ />
      <FinalCTA />
    </>
  );
}

export default App;
