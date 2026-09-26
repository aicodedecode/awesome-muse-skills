import Reveal from './Reveal';

const COLLECTIONS = [
  {
    org: 'anthropics',
    repo: 'skills',
    name: 'anthropics / skills',
    desc: 'Anthropic’s official open-source Agent Skills — the format this catalog is built on.',
  },
  {
    org: 'davila7',
    repo: 'claude-code-templates',
    name: 'davila7 / claude-code-templates',
    desc: 'The community template collection whose topic map inspired this catalog’s structure.',
  },
  {
    org: 'harshsinghmp',
    repo: 'skills',
    name: 'harshsinghmp / skills',
    desc: 'A community skills collection worth exploring alongside this one.',
  },
  {
    org: 'vercel-labs',
    repo: 'agent-skills',
    name: 'vercel-labs / agent-skills',
    desc: 'Web-design and interface guidelines as agent skills.',
  },
  {
    org: 'mattpocock',
    repo: 'skills',
    name: 'mattpocock / skills',
    desc: 'TypeScript and developer-workflow skills from the community.',
  },
  {
    org: 'addyosmani',
    repo: 'agent-skills',
    name: 'addyosmani / agent-skills',
    desc: 'Web performance and frontend skills.',
  },
];

export default function Ecosystem() {
  return (
    <section className="section" id="ecosystem">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <div className="section-kicker">Ecosystem</div>
            <h2 className="section-title">Part of a bigger movement</h2>
            <p className="section-sub">
              Agent Skills are an open format. These community collections are
              linked with attribution — the imported skills live in the
              maintainer&rsquo;s private library, not copied here.
            </p>
          </div>
        </Reveal>
        <div className="eco-grid">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.name} delay={Math.min(i, 5) * 80}>
              <a
                href={`https://github.com/${c.org}/${c.repo}`}
                target="_blank"
                rel="noreferrer"
                className="eco-card"
              >
                <h3>
                  {c.org} <span>/</span> {c.repo}
                </h3>
                <p>{c.desc}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
