import type { Metadata } from 'next';
import CatalogClient from '../components/CatalogClient';
import Reveal from '../components/Reveal';
import { getSkills, getCategories } from '../../lib/skills';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Search and browse all 899 original Muse skills across 31 categories.',
};

export default function CatalogPage() {
  const skills = getSkills();
  const categories = getCategories();

  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
      <Reveal>
        <div className="section-head">
          <div className="section-kicker">Catalog</div>
          <h1 className="section-title">Every skill, searchable</h1>
          <p className="section-sub">
            {skills.length} original skills across {categories.length}{' '}
            categories. Search by name or topic, or filter by category.
          </p>
        </div>
      </Reveal>
      <CatalogClient skills={skills} categories={categories} />
    </div>
  );
}
