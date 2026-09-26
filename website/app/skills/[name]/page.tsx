import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSkills, getSkill } from '../../lib/skills';

const REPO_URL = 'https://github.com/aicodedecode/awesome-muse-skills';

export function generateStaticParams() {
  return getSkills().map((s) => ({ name: s.name }));
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = getSkill(name);
  if (!skill) notFound();

  const useSkill = {
    intro:
      "Meta's Muse doesn't have an official skill-install flow yet — using a skill takes seconds right in chat:",
    steps: [
      `Open this skill's source below and copy the full SKILL.md text.`,
      `Paste it into a chat with Muse and add: "Please use this skill whenever I ask about ${skill.name.replace(/-/g, ' ')}. Remember it for our future conversations."`,
      `That's it — Muse follows the skill for relevant tasks, and you approve anything it does.`,
    ],
  };

  return (
    <article className="detail">
      <Link href="/" className="back">
        &larr; All skills
      </Link>
      <span className="tag">{skill.category}</span>
      <h1>{skill.name}</h1>
      <p className="lede">{skill.description}</p>

      <h2>How to use with Muse</h2>
      <div className="install-box">
        <p>{useSkill.intro}</p>
        <ol>
          {useSkill.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        <p className="hint">
          <a href={skill.github_url} target="_blank" rel="noreferrer">
            Copy the SKILL.md source from GitHub
          </a>{' '}
          — then paste it into chat. When Meta ships native skill support, this
          file is already in the right format.
        </p>
      </div>

      <p>
        <a href={skill.github_url} target="_blank" rel="noreferrer">
          View source on GitHub
        </a>
        {' · '}
        License: {skill.license} · Author: {skill.author}
      </p>
    </article>
  );
}
