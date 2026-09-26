import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import SkillOfDay from './components/SkillOfDay';
import CategoryGrid from './components/CategoryGrid';
import FeaturedSkills from './components/FeaturedSkills';
import Faq from './components/Faq';
import Reveal from './components/Reveal';
import { getSkills } from '../lib/skills';

export default function Home() {
  const tickerNames = getSkills()
    .filter((_, i) => i % 9 === 0)
    .map((s) => s.name);

  return (
    <>
      <Hero tickerNames={tickerNames} />
      <Stats />
      <HowItWorks />
      <SkillOfDay />
      <FeaturedSkills />
      <CategoryGrid />
      <Faq />
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-band">
              <h2>
                Find the skill your <em>next question</em> needs
              </h2>
              <p>
                899 original skills, free forever. Read one in full, copy it,
                and paste it into chat with Muse.
              </p>
              <a href="/skills" className="btn btn-paper">
                Explore the catalog →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
