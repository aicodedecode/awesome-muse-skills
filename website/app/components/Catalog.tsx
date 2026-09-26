'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Skill } from '../../lib/skills';

export default function Catalog({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: string[];
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      const matchesCategory = !activeCategory || s.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [skills, query, activeCategory]);

  return (
    <>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search skills…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search skills"
        />
        <div className="chips" role="group" aria-label="Filter by category">
          <button
            className={activeCategory === null ? 'chip active' : 'chip'}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={activeCategory === c ? 'chip active' : 'chip'}
              onClick={() => setActiveCategory(activeCategory === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No skills match your search.</p>
      ) : (
        <div className="grid">
          {filtered.map((s) => (
            <article key={s.name} className="card">
              <span className="tag">{s.category}</span>
              <h2>
                <Link href={`/skills/${s.name}`}>{s.name}</Link>
              </h2>
              <p>{s.description}</p>
              <div className="card-links">
                <Link href={`/skills/${s.name}`}>Details</Link>
                <a href={s.github_url} target="_blank" rel="noreferrer">
                  View on GitHub
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
