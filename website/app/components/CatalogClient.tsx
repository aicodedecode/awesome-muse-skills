'use client';

import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import SkillCard from './SkillCard';
import type { ImportedSkill, Skill } from '../../lib/skills';

type Collection = 'originals' | 'imports';

export default function CatalogClient({
  originalSkills,
  originalCategories,
  importedSkills,
  importedCategories,
}: {
  originalSkills: Skill[];
  originalCategories: string[];
  importedSkills: ImportedSkill[];
  importedCategories: string[];
}) {
  // Start on originals so the static HTML ships a real, SEO-friendly grid;
  // URL params (?q= / ?category= / ?set=) are applied right after hydration.
  const [set, setSet] = useState<Collection>('originals');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  const skills = set === 'originals' ? originalSkills : importedSkills;
  const categories =
    set === 'originals' ? originalCategories : importedCategories;
  const basePath = set === 'originals' ? '/skills' : '/skills/imported';

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get('q') ?? '');
    const next: Collection = sp.get('set') === 'imports' ? 'imports' : 'originals';
    setSet(next);
    // ?category= historically applies to the originals collection; when
    // ?set=imports is given, it applies to the imports collection instead.
    const cats = next === 'originals' ? originalCategories : importedCategories;
    const c = sp.get('category') ?? '';
    if (cats.includes(c)) setCat(c);
  }, [originalCategories, importedCategories]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return skills.filter((s) => {
      if (cat && s.category !== cat) return false;
      if (!needle) return true;
      return (
        s.name.toLowerCase().includes(needle) ||
        s.description.toLowerCase().includes(needle)
      );
    });
  }, [skills, q, cat]);

  const switchSet = (next: Collection) => {
    if (next === set) return;
    setSet(next);
    setCat('');
    const url = new URL(window.location.href);
    if (next === 'imports') url.searchParams.set('set', 'imports');
    else url.searchParams.delete('set');
    window.history.replaceState(null, '', url);
  };

  const noun = set === 'originals' ? 'original skills' : 'curated imports';

  return (
    <>
      <div
        className="collection-toggle"
        role="group"
        aria-label="Choose skill collection"
      >
        <button
          type="button"
          className={set === 'originals' ? 'active' : ''}
          onClick={() => switchSet('originals')}
        >
          Originals
          <span className="count">{originalSkills.length}</span>
        </button>
        <button
          type="button"
          className={set === 'imports' ? 'active' : ''}
          onClick={() => switchSet('imports')}
        >
          Curated imports
          <span className="count">{importedSkills.length.toLocaleString()}</span>
        </button>
      </div>

      <div className="toolbar">
        <div className="searchbar">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${skills.length.toLocaleString()} ${noun}…`}
            aria-label="Search skills"
          />
        </div>
        <div className="pills" role="group" aria-label="Filter by category">
          <button
            className={`pill${cat === '' ? ' active' : ''}`}
            onClick={() => setCat('')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`pill${cat === c ? ' active' : ''}`}
              onClick={() => setCat(cat === c ? '' : c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="result-meta">
          {filtered.length} of {skills.length.toLocaleString()} {noun}
          {cat ? ` in ${cat}` : ''}
          {q.trim() ? ` matching “${q.trim()}”` : ''}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <h3>No skills found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="skill-grid">
          {filtered.slice(0, 120).map((s, i) => (
            <Reveal key={s.name} delay={Math.min(i % 12, 6) * 40}>
              <SkillCard skill={s} basePath={basePath} />
            </Reveal>
          ))}
        </div>
      )}
      {filtered.length > 120 && (
        <p
          className="result-meta"
          style={{ marginTop: '1.6rem', textAlign: 'center' }}
        >
          Showing the first 120 of {filtered.length} — refine your search to
          see more.
        </p>
      )}
    </>
  );
}
