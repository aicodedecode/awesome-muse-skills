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
      <Hero tickerNames={tickerNames} originalCount={899} importCount={1484} />
      <Stats />
      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div className="section-kicker">Two collections</div>
              <h2 className="section-title">Originals &amp; curated imports</h2>
              <p className="section-sub">
                One catalog, two ways to get a skill — both free, both
                readable in full right here.
              </p>
            </div>
          </Reveal>
          <div className="steps steps-2">
            <Reveal>
              <div className="step">
                <span className="skill-tag">899 originals</span>
                <h3>Written from scratch for Muse</h3>
                <p>
                  Hand-written playbooks for Meta&rsquo;s Muse — safety
                  reviewed, no installers, ready to paste into chat.
                </p>
                <a href="/skills" className="section-link">
                  Browse originals <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={90}>
              <div className="step">
                <span className="skill-tag skill-tag-import">
                  1,484 curated imports
                </span>
                <h3>The best open-source skills from across GitHub</h3>
                <p>
                  Safety-reviewed, republished with attribution — the finest
                  community skills, collected in one searchable place.
                </p>
                <a href="/skills?set=imports" className="section-link">
                  Browse curated imports <span aria-hidden="true">→</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
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
                2,383 skills, free forever. Read one in full, copy it, and
                paste it into chat with Muse.
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
