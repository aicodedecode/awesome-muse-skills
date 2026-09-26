'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Reveal from './Reveal';

const QUICK = [
  'development',
  'productivity',
  'creative-design',
  'scientific',
  'everyday-assistant',
];

function Ticker({ names }: { names: string[] }) {
  const items = [...names, ...names];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((n, i) => (
          <span key={i}>
            <b>✦</b> {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ tickerNames }: { tickerNames: string[] }) {
  const [q, setQ] = useState('');
  const router = useRouter();

  const go = (e: FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/skills?q=${encodeURIComponent(q.trim())}` : '/skills');
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <Reveal>
            <span className="hero-kicker">
              <span className="dot" aria-hidden="true" />
              899 original skills · 31 categories · MIT
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1>
              A skill for <em>everything</em> you ask of Muse
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="hero-sub">
              Community-written playbooks for Meta&rsquo;s Muse personal
              assistant — from debugging Kubernetes to baking sourdough to
              prepping for UPSC. Read any skill in full right here, copy it,
              paste it into chat.
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
              <button type="submit" className="btn btn-accent btn-sm">
                Search
              </button>
            </form>
            <div className="hero-chips">
              <span>Popular:</span>
              {QUICK.map((c) => (
                <a key={c} href={`/skills?category=${encodeURIComponent(c)}`}>
                  {c}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <Ticker names={tickerNames} />
    </>
  );
}
