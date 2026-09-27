import type { Metadata } from 'next';
import CatalogClient from '../components/CatalogClient';
import Reveal from '../components/Reveal';
import {
  getSkills,
  getCategories,
  getImportedSkills,
  getImportedCategories,
} from '../../lib/skills';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Search and browse 899 original Muse skills plus 1,466 curated open-source imports across two collections.',
};

export default function CatalogPage() {
  const originalSkills = getSkills();
  const originalCategories = getCategories();
  const importedSkills = getImportedSkills();
  const importedCategories = getImportedCategories();
  const total = originalSkills.length + importedSkills.length;

  return (
    <div
      className="container"
      style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}
    >
      <Reveal>
        <div className="section-head">
          <div className="section-kicker">Catalog</div>
          <h1 className="section-title">Every skill, searchable</h1>
          <p className="section-sub">
            {total.toLocaleString()} skills across two collections —{' '}
            {originalSkills.length} originals written from scratch, and{' '}
            {importedSkills.length.toLocaleString()} curated imports from
            across open source. Search by name or topic, or filter by category.
          </p>
        </div>
      </Reveal>
      <CatalogClient
        originalSkills={originalSkills}
        originalCategories={originalCategories}
        importedSkills={importedSkills}
        importedCategories={importedCategories}
      />
    </div>
  );
}
