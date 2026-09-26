import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import CategoryGrid from './components/CategoryGrid';
import FeaturedSkills from './components/FeaturedSkills';
import Ecosystem from './components/Ecosystem';
import Faq from './components/Faq';
import Reveal from './components/Reveal';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <HowItWorks />
      <FeaturedSkills />
      <CategoryGrid />
      <Ecosystem />
      <Faq />
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="cta-band">
              <h2>
                Ready to give Muse a <span className="grad-text">new skill</span>?
              </h2>
              <p>
                Browse 899 original skills — free, open source, and ready to
                paste into chat.
              </p>
              <a href="/skills" className="btn btn-primary">
                Explore the catalog →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
