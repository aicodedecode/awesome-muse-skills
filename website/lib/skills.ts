import fs from 'fs';
import path from 'path';
import skillsData from '../data/skills.json';
import importedSkillsData from '../data/skills-imported.json';

export interface SkillBase {
  name: string;
  description: string;
  category: string;
  path: string;
  github_url: string;
  author: string;
}

export interface Skill extends SkillBase {
  license: string;
}

export interface ImportedSkill extends SkillBase {
  origin: 'curated-import';
  source: string | null;
  source_url: string | null;
  license: string | null;
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

export function getImportedSkills(): ImportedSkill[] {
  return importedSkillsData as ImportedSkill[];
}

export function getImportedSkill(name: string): ImportedSkill | undefined {
  return getImportedSkills().find((s) => s.name === name);
}

export function getImportedCategories(): string[] {
  const cats = new Set(getImportedSkills().map((s) => s.category));
  return Array.from(cats).sort();
}

export function getImportedCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const s of getImportedSkills())
    counts[s.category] = (counts[s.category] || 0) + 1;
  return counts;
}

/**
 * Raw SKILL.md source, read at build time from the skill entry's own path
 * (works for both skills/ and skills-imported/). Accepts the skill entry
 * directly, or a skill name (looked up among the originals).
 */
export function getSkillSource(skill: SkillBase | string): string | null {
  // server-only: called from server components during static generation
  const entry = typeof skill === 'string' ? getSkill(skill) : skill;
  if (!entry || !entry.path) return null;
  const safePath = entry.path
    .split('/')
    .filter((p) => p && p !== '.' && p !== '..')
    .join('/');
  const file = path.join(process.cwd(), '..', safePath, 'SKILL.md');
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
