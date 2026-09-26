import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  getSkills,
  getSkill,
  getSkillSource,
  stripFrontmatter,
} from '../../../lib/skills';
import CopyButton from '../../components/CopyButton';
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

  const raw = getSkillSource(skill.name);
  const body = raw ? stripFrontmatter(raw) : null;

  const related = getSkills()
    .filter((s) => s.category === skill.category && s.name !== skill.name)
    .slice(0, 3);

  return (
    <div className="container">
      <article className="detail">
        <div className="detail-inner">
          <Reveal>
            <Link href="/skills" className="back">
              <span aria-hidden="true">←</span> All skills
            </Link>
            <div>
              <Link
                href={`/skills?category=${encodeURIComponent(skill.category)}`}
              >
                <span className="skill-tag">{skill.category}</span>
              </Link>
            </div>
            <h1>{skill.name}</h1>
            <p className="lede">{skill.description}</p>
          </Reveal>

          <Reveal>
            <h2>Use this skill</h2>
            <div className="use-panel">
              <ol className="use-steps">
                <li data-n="1">
                  <span>
                    <strong>Read the full skill below</strong> — it&rsquo;s all
                    right here on this page. When you like it, hit copy.
                  </span>
                </li>
                <li data-n="2">
                  <span>
                    <strong>Paste it into a chat with Muse</strong> and add:{' '}
                    <em>
                      “Please use this skill whenever I ask about{' '}
                      {skill.name.replace(/-/g, ' ')}. Remember it for our
                      future conversations.”
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
              {raw && (
                <div className="copy-row">
                  <CopyButton text={raw} />
                  <a
                    className="btn btn-ghost btn-sm"
                    href={skill.github_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View raw on GitHub ↗
                  </a>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal>
            <h2>The full skill</h2>
            {body ? (
              <div className="md-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {body}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="empty">
                <h3>Source unavailable</h3>
                <p>
                  The full text couldn&rsquo;t be loaded —{' '}
                  <a href={skill.github_url} target="_blank" rel="noreferrer">
                    read it on GitHub
                  </a>
                  .
                </p>
              </div>
            )}
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
        </div>

        {related.length > 0 && (
          <div className="related" style={{ marginTop: '3.5rem' }}>
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
