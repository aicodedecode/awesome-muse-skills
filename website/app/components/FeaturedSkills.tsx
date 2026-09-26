import Reveal from './Reveal';
import SkillCard from './SkillCard';
import { getSkill } from '../../lib/skills';

const FEATURED = [
  'getting-started-with-muse-skills',
  'calendar-pro-guide',
  'pr-specialist',
  'laravel-pro',
  'video-marketer',
  'astrometry-basics',
];

export default function FeaturedSkills() {
  const skills = FEATURED.map(getSkill).filter((s) => s !== undefined);

  return (
    <section className="section" id="featured">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div className="section-kicker">Staff picks</div>
            <h2 className="section-title">Start with these</h2>
            <p className="section-sub">
              A taste of the range — from onboarding to engineering to the
              night sky.
            </p>
          </div>
        </Reveal>
        <div className="skill-grid">
          {skills.map((s, i) => (
            <Reveal key={s!.name} delay={Math.min(i, 5) * 80}>
              <SkillCard skill={s!} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
