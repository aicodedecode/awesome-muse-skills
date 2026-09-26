import Link from 'next/link';
import Reveal from './Reveal';
import { getCategoryCounts } from '../../lib/skills';

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'ai-maestro': 'Command fleets of local AI agents with the AI Maestro CLI.',
  'ai-research': 'LLM & agent R&D — frameworks, RAG, evals, benchmarks.',
  analytics: 'Product analytics with Google Analytics 4.',
  'business-marketing': 'Marketing, branding, and business playbooks.',
  career: 'Resumes, interviews, networking, negotiation.',
  'creative-design': 'UI/UX, brand, typography, illustration, 3D.',
  curviate: 'SaaS platform operations — vendor-neutral guides.',
  database: 'SQL/NoSQL modeling, tuning, migrations, ORMs.',
  development: 'Software engineering — languages, testing, DevOps.',
  'document-processing': 'PDF, Office, OCR, translation workflows.',
  doordash: 'On-demand delivery platform patterns.',
  'enterprise-communication': 'Chat, email, meetings, incident comms.',
  'everyday-assistant': 'Daily life with a personal AI assistant.',
  git: 'Branching, commits, worktrees, GitHub workflows.',
  marketing: 'Social media research patterns — organic only.',
  media: 'Image, video, and audio processing.',
  muse: 'Start here: how Muse skills work.',
  'open-banking-io': 'Open banking concepts — AIS/PIS, PSD2.',
  operations: 'SRE — SLOs, incidents, on-call.',
  pocketbase: 'PocketBase backend — auth, realtime, files.',
  productivity: 'Notes, tasks, focus, and OS tooling.',
  railway: 'PaaS deployment patterns — vendor-neutral.',
  scientific: 'Life & physical sciences computing.',
  security: 'AppSec, SOC, identity — defensive only.',
  sentry: 'Observability — errors, tracing, performance.',
  sports: 'Sports match-prediction methodology.',
  utilities: 'QR, regex, JSON, UUID, cron, diff, encodings.',
  video: 'Editing, recording, subtitles, compression.',
  'web-data': 'Scraping and browser automation.',
  'web-development': 'Frameworks, UI, auth, performance.',
  'workflow-automation': 'n8n, GitHub Actions, GitOps.',
};

export default function CategoryGrid() {
  const counts = getCategoryCounts();
  const cats = Object.keys(counts).sort();

  return (
    <section className="section" id="categories">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div className="section-kicker">Browse</div>
            <h2 className="section-title">31 categories, zero filler</h2>
            <p className="section-sub">
              Every skill was written from scratch for this catalog — no
              copied text, no thin wrappers. Pick a lane.
            </p>
          </div>
        </Reveal>
        <div className="cat-grid">
          {cats.map((c, i) => (
            <Reveal key={c} delay={Math.min(i, 11) * 45}>
              <Link href={`/skills?category=${encodeURIComponent(c)}`} className="cat-card">
                <div className="cat-top">
                  <span className="cat-name">{c}</span>
                  <span className="cat-count">{counts[c]}</span>
                </div>
                <p className="cat-desc">
                  {CATEGORY_DESCRIPTIONS[c] ?? 'Community skills for this topic.'}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
