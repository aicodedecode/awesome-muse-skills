'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './Reveal';

export default function Hero() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const go = (e: FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/skills?q=${encodeURIComponent(q.trim())}` : '/skills');
  };

  return (
    <section className="hero">
      <div className="hero-orb a" aria-hidden="true" />
      <div className="hero-orb b" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <span className="hero-badge">
            <span className="dot" aria-hidden="true" />
            899 skills · 31 categories · MIT licensed
          </span>
        </Reveal>
        <Reveal delay={90}>
          <h1>
            Give Muse <span className="grad-text">new superpowers</span> in
            seconds
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p className="hero-sub">
            A community catalog of agent skills for Meta&rsquo;s Muse personal
            assistant — reusable <code>SKILL.md</code> playbooks for work,
            study, creativity, and everyday life. No installers: copy a skill,
            paste it into chat, done.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="hero-ctas">
            <a href="/skills" className="btn btn-primary">
              Browse the catalog →
            </a>
            <a href="#how" className="btn btn-ghost">
              How it works
            </a>
          </div>
        </Reveal>
        <Reveal delay={340}>
          <form className="hero-search" onSubmit={go} role="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try “resume”, “sourdough”, “kubernetes”…"
              aria-label="Search skills"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
