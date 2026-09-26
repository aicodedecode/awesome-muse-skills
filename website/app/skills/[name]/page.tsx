import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSkills, getSkill } from '../../../lib/skills';
import SkillSource from '../../components/SkillSource';
import SkillCard from '../../components/SkillCard';
import Reveal from '../../components/Reveal';

export function generateStaticParams() {
  return getSkills().map((s) => ({ name: s.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) return { title: 'Skill not found' };
  return {
    title: skill.name,
    description: skill.description,
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) notFound();

  const related = getSkills()
    .filter((s) => s.category === skill.category && s.name !== skill.name)
    .slice(0, 3);

  return (
    <div className="container">
      <article className="detail">
        <Reveal>
          <Link href="/skills" className="back">
            <span aria-hidden="true">←</span> All skills
          </Link>
          <div>
            <Link href={`/skills?category=${encodeURIComponent(skill.category)}`}>
              <span className="skill-tag">{skill.category}</span>
            </Link>
          </div>
          <h1>{skill.name}</h1>
          <p className="lede">{skill.description}</p>
        </Reveal>

        <Reveal>
          <h2>How to use with Muse</h2>
          <div className="use-panel">
            <ol className="use-steps">
              <li data-n="1">
                <span>
                  <strong>Copy the skill text</strong> below — the full{' '}
                  <code>SKILL.md</code>, one tap.
                </span>
              </li>
              <li data-n="2">
                <span>
                  <strong>Paste it into a chat with Muse</strong> and add:{' '}
                  <em>
                    “Please use this skill whenever I ask about{' '}
                    {skill.name.replace(/-/g, ' ')}. Remember it for our future
                    conversations.”
                  </em>
                </span>
              </li>
              <li data-n="3">
                <span>
                  <strong>That&rsquo;s it.</strong> Muse follows the playbook
                  for relevant tasks, and you approve anything it does.
                </span>
              </li>
            </ol>
            <SkillSource skillName={skill.name} />
            <p
              style={{
                color: 'var(--faint)',
                fontSize: '0.88rem',
                margin: '1.2rem 0 0',
              }}
            >
              Meta&rsquo;s Muse doesn&rsquo;t have an official skill-install
              flow yet — this is the path that works today. If native support
              ships, this file is already in the right format.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="meta-row">
            <span>
              Source:{' '}
              <a href={skill.github_url} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </span>
            <span>License: {skill.license}</span>
            <span>Author: {skill.author}</span>
          </div>
        </Reveal>

        {related.length > 0 && (
          <div className="related">
            <Reveal>
              <h2>More in {skill.category}</h2>
            </Reveal>
            <div className="skill-grid">
              {related.map((s, i) => (
                <Reveal key={s.name} delay={i * 80}>
                  <SkillCard skill={s} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
