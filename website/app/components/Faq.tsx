'use client';

import { useState } from 'react';
import Reveal from './Reveal';

const FAQS = [
  {
    q: 'How do I actually use a skill with Muse?',
    a: 'Open any skill page, copy the SKILL.md text with the copy button, and paste it into a chat with Muse. Add “remember this skill for our future conversations” and Muse will follow the playbook whenever it’s relevant. There’s no installer or upload flow in the Muse app today — this is the path that works.',
  },
  {
    q: 'Will there be an official install button someday?',
    a: 'Maybe — if Meta ships native skill support for Muse, these files are already in the Agent Skills format, so they’ll slot right in. Until then, the copy-paste path is the honest one, and this catalog won’t pretend otherwise.',
  },
  {
    q: 'Are these skills really original?',
    a: 'Two kinds, both honest. The 899 originals were written from scratch for this catalog — zero copied text. The 1,485 curated imports are the best open-source skills from across GitHub, safety-reviewed and republished here with attribution to their original authors, source repositories, and licenses.',
  },
  {
    q: 'Can I contribute a skill?',
    a: 'Absolutely — the repo is MIT licensed and contributions are welcome. See CONTRIBUTING.md on GitHub for the format: a folder with a SKILL.md following the Agent Skills spec, plus an entry in the catalog data.',
  },
  {
    q: 'Do skills work with other AI assistants?',
    a: 'Skills follow the open Agent Skills format (SKILL.md with YAML frontmatter), so the same files work with any assistant that supports the format — the workflow taught here is written for Meta’s Muse.',
  },
  {
    q: 'Is this affiliated with Meta?',
    a: 'No. This is an unofficial community project, not affiliated with, endorsed by, or sponsored by Meta. “Muse” is a trademark of Meta Platforms, Inc.',
  },
];

function Item({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className={`faq-item${open ? ' open' : ''}`}>
        <button
          className="faq-q"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {q}
          <svg
            className="chev"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <div className="faq-a" style={{ maxHeight: open ? '300px' : '0px' }}>
          <p>{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div className="section-kicker">FAQ</div>
            <h2 className="section-title">Questions, answered honestly</h2>
          </div>
        </Reveal>
        <div className="faq">
          {FAQS.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} delay={Math.min(i, 5) * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}
