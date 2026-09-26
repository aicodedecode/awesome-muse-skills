import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Awesome Muse Skills',
  description:
    'A community catalog of agent skills for Meta\u2019s Muse personal assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="brand">
              Awesome Muse Skills
            </a>
            <nav>
              <a
                href="https://github.com/aicodedecode/awesome-muse-skills"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              Unofficial community project. Not affiliated with or endorsed by
              Meta. &ldquo;Muse&rdquo; is a trademark of Meta Platforms, Inc.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
