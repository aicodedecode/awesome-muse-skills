'use client';

import { useEffect, useMemo, useState } from 'react';
import Reveal from './Reveal';
import SkillCard from './SkillCard';
import type { Skill } from '../../lib/skills';

export default function CatalogClient({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: string[];
}) {
  // Start unfiltered so the static HTML ships a real, SEO-friendly grid;
  // URL params (?q= / ?category=) are applied right after hydration.
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setQ(sp.get('q') ?? '');
    const c = sp.get('category') ?? '';
    if (categories.includes(c)) setCat(c);
  }, [categories]);

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

  return (
    <>
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
            placeholder="Search 899 skills…"
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
          {filtered.length} of {skills.length} skills
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
              <SkillCard skill={s} />
            </Reveal>
          ))}
        </div>
      )}
      {filtered.length > 120 && (
        <p className="result-meta" style={{ marginTop: '1.6rem', textAlign: 'center' }}>
          Showing the first 120 of {filtered.length} — refine your search to see more.
        </p>
      )}
    </>
  );
}
