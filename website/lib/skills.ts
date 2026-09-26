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
