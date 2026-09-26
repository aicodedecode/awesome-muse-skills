import fs from 'fs';
import path from 'path';
import skillsData from '../data/skills.json';

export interface Skill {
  name: string;
  description: string;
  category: string;
  path: string;
  github_url: string;
  author: string;
  license: string;
}

export function getSkills(): Skill[] {
  return skillsData as Skill[];
}

export function getSkill(name: string): Skill | undefined {
  return getSkills().find((s) => s.name === name);
}

export function getCategories(): string[] {
  const cats = new Set(getSkills().map((s) => s.category));
  return Array.from(cats).sort();
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of getSkills()) counts[s.category] = (counts[s.category] || 0) + 1;
  return counts;
}

/** Raw SKILL.md source for a skill, read at build time from the repo. */
export function getSkillSource(name: string): string | null {
  // server-only: called from server components during static generation
  const safe = name.replace(/[^a-z0-9-]/gi, '');
  const file = path.join(process.cwd(), '..', 'skills', safe, 'SKILL.md');
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

/** Strip YAML frontmatter (--- ... ---) from a markdown source. */
export function stripFrontmatter(md: string): string {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trimStart();
}

/** Deterministic "skill of the day" pick based on the calendar date. */
export function getSkillOfTheDay(): Skill {
  const skills = getSkills();
  const now = new Date();
  const dayIndex = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000
  );
  return skills[dayIndex % skills.length];
}
