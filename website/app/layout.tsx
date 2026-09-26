import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://aimuse-rho.vercel.app/'),
  title: {
    default: 'Awesome Muse Skills — 899 agent skills for Meta’s Muse',
    template: '%s · Awesome Muse Skills',
  },
  description:
    'A community catalog of 899 original agent skills for Meta’s Muse personal assistant — browse, search, and use them in seconds. Free and open source (MIT).',
  openGraph: {
    title: 'Awesome Muse Skills',
    description:
      '899 original agent skills for Meta’s Muse — browse, search, copy a SKILL.md, and paste it into chat.',
    type: 'website',
  },
};

const REPO = 'https://github.com/aicodedecode/awesome-muse-skills';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <div className="page-glow" aria-hidden="true" />
        <div className="page-grid" aria-hidden="true" />
        <header className="nav">
          <div className="container nav-inner">
            <a href="/" className="brand">
              <span className="brand-mark" aria-hidden="true">
                ✦
              </span>
              Awesome Muse Skills
            </a>
            <nav className="nav-links" aria-label="Primary">
              <a href="/skills">Catalog</a>
              <a href="/#how">How it works</a>
              <a href="/#ecosystem">Ecosystem</a>
              <a href="/#faq">FAQ</a>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="container">
            <div className="foot-inner">
              <div className="foot-brand">
                <a href="/" className="brand">
                  <span className="brand-mark" aria-hidden="true">
                    ✦
                  </span>
                  Awesome Muse Skills
                </a>
                <p>
                  A community catalog of agent skills for Meta&rsquo;s Muse
                  personal assistant. Free and open source under the MIT
                  license.
                </p>
              </div>
              <nav className="foot-links" aria-label="Footer">
                <a href="/skills">Catalog</a>
                <a href="/#how">How it works</a>
                <a href="/#ecosystem">Ecosystem</a>
                <a href="/#faq">FAQ</a>
                <a href={REPO} target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </nav>
              <p className="foot-note">
                Unofficial community project. Not affiliated with, endorsed by,
                or sponsored by Meta. &ldquo;Muse&rdquo; is a trademark of Meta
                Platforms, Inc.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
