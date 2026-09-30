import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aimuse-rho.vercel.app/'),
  title: {
    default: 'Awesome Muse Skills — 2,383 agent skills for Meta’s Muse',
    template: '%s · Awesome Muse Skills',
  },
  description:
    'A community catalog of 2,383 agent skills for Meta’s Muse personal assistant — 899 originals written from scratch plus 1,484 curated open-source imports. Browse, search, and use them in seconds. Free and open source (MIT).',
  openGraph: {
    title: 'Awesome Muse Skills',
    description:
      '2,383 agent skills for Meta’s Muse — browse, search, read the full skill on the site, copy it, and paste it into chat.',
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <div className="ambient" aria-hidden="true">
          <div className="wash w1" />
          <div className="wash w2" />
          <div className="wash w3" />
          <div className="dots" />
        </div>
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
                  personal assistant. 899 skills written from scratch, plus
                  1,484 curated open-source imports republished with
                  attribution. Free and open source under the MIT license.
                </p>
              </div>
              <nav className="foot-links" aria-label="Footer">
                <a href="/skills">Catalog</a>
                <a href="/#how">How it works</a>
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
