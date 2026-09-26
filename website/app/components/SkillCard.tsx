import Link from 'next/link';
import type { Skill } from '../../lib/skills';

export default function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skills/${skill.name}`} className="skill-card">
      <span className="skill-tag">{skill.category}</span>
      <h3>{skill.name}</h3>
      <p>{skill.description}</p>
      <span className="go">
        View skill <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
