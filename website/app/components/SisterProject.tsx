'use client';

import { useState } from 'react';
import Reveal from './Reveal';

const CODES = ['3C77QC', 'N8DCUB'];

function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        border: '1px solid var(--line-strong)',
        borderRadius: '12px',
        padding: '0.45rem 0.45rem 0.45rem 1rem',
        background: 'var(--paper)',
      }}
    >
      <code
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem',
          letterSpacing: '0.08em',
        }}
      >
        {code}
      </code>
      <button className="btn btn-accent btn-sm" onClick={copy}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </span>
  );
}

/**
 * Sister-project strip: museaicodes.com — the Muse AI guide hub —
 * plus its referral-code token offer. Reward wording stays soft per
 * policy: eligibility and amounts vary, confirm in the app.
 */
export default function SisterProject() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal>
          <div
            style={{
              border: '1px solid var(--line-strong)',
              borderRadius: '22px',
              padding: '2.4rem 2rem',
              background: 'var(--card)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ maxWidth: '34rem' }}>
              <div className="section-kicker">Sister project</div>
              <h2
                className="section-title"
                style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}
              >
                New to Muse? Start at the guide hub
              </h2>
              <p className="section-sub" style={{ marginTop: '0.7rem' }}>
                <strong>museaicodes.com</strong> — guides, comparisons, and
                tools for Meta&rsquo;s Muse AI. New users can also redeem a
                referral code toward a promotional token offer (up to 1
                billion tokens). Eligibility, amounts, and availability vary
                — confirm the current terms in Muse&rsquo;s redeem screen.
              </p>
              <a
                href="https://museaicodes.com"
                className="section-link"
                style={{ marginTop: '1rem' }}
              >
                Visit museaicodes.com <span aria-hidden="true">→</span>
              </a>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--faint)',
                }}
              >
                Referral codes
              </span>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {CODES.map((c) => (
                  <CodeChip key={c} code={c} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
