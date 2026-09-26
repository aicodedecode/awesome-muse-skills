import { getSkills, getCategories } from '../lib/skills';
import Catalog from './components/Catalog';

export default function Home() {
  const skills = getSkills();
  const categories = getCategories();

  return (
    <>
      <section className="hero">
        <h1>Awesome Muse Skills</h1>
        <p>
          A community catalog of agent skills for Meta&rsquo;s Muse personal
          assistant. Each skill is a portable <code>SKILL.md</code> file —
          copy the folder, point your assistant at it, and go. Free and open
          source (MIT).
        </p>
      </section>
      <Catalog skills={skills} categories={categories} />
    </>
  );
}
