import Link from 'next/link';
import Reveal from './Reveal';
import { getSkillOfTheDay } from '../../lib/skills';

export default function SkillOfDay() {
  const skill = getSkillOfTheDay();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="section" id="skill-of-the-day">
      <div className="container">
        <Reveal>
          <Link href={`/skills/${skill.name}`} className="sotd">
            <div className="sotd-side">
              <span className="sotd-kicker">Skill of the day</span>
              <span className="sotd-date">{today}</span>
            </div>
            <div className="sotd-main">
              <span className="sotd-tag">{skill.category}</span>
              <h3>{skill.name}</h3>
              <p>{skill.description}</p>
              <span className="sotd-go">Read the full skill →</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
