'use client';

import { useEffect, useState } from 'react';

const RAW_BASE =
  'https://raw.githubusercontent.com/aicodedecode/awesome-muse-skills/main';

export default function SkillSource({ skillName }: { skillName: string }) {
  const [text, setText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(`${RAW_BASE}/skills/${skillName}/SKILL.md`)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.text();
      })
      .then((t) => {
        if (live) setText(t);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [skillName]);

  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="source-box">
      <div className="source-head">
        <span>SKILL.md</span>
        <div className="actions">
          <button
            className={`mini-btn${copied ? ' copied' : ''}`}
            onClick={copy}
            disabled={!text}
          >
            {copied ? '✓ Copied!' : 'Copy full text'}
          </button>
          <a
            className="mini-btn"
            href={`https://github.com/aicodedecode/awesome-muse-skills/blob/main/skills/${skillName}/SKILL.md`}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
      <pre>
        {text ?? (failed ? 'Could not load the preview — open it on GitHub instead.' : 'Loading SKILL.md…')}
      </pre>
    </div>
  );
}
