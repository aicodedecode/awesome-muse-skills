import Reveal from './Reveal';

const STEPS = [
  {
    title: 'Pick a skill',
    body: 'Browse 2,648 skills across two collections — 899 originals written from scratch, plus 1,749 curated open-source imports. Each one is a single SKILL.md file.',
  },
  {
    title: 'Copy the source',
    body: 'Every skill page shows the full SKILL.md text with a one-tap copy button. No downloads, no installers, no accounts.',
  },
  {
    title: 'Paste it into chat',
    body: 'Paste it into a conversation with Muse and ask it to remember the skill. From then on, Muse follows the playbook whenever it fits.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div className="section-kicker">How it works</div>
            <h2 className="section-title">From skill to superpower in 30 seconds</h2>
            <p className="section-sub">
              Meta&rsquo;s Muse app doesn&rsquo;t have an official skill-install
              flow yet — so this catalog teaches the honest path that works
              today: copy, paste, remember.
            </p>
          </div>
        </Reveal>
        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 110}>
              <div className="step">
                <span className="step-num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
