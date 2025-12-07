import { generateBibTexEntry } from './BibTexEntryFactory';
import { RegistrationSearchItem } from '../../types/registration.types';
import { BibTeXDatabase, BibTeXEntry, BibTeXType } from 'bibtex-generator';

export const exportToBibTex = (registrations: RegistrationSearchItem[], totalNumberOfRegistrations: number) => {
  const database = new BibTeXDatabase();
  registrations.forEach((registration, index) => {
    database.add(generateBibTexEntry(registration, index.toString()));
  });

  if (totalNumberOfRegistrations > registrations.length) {
    database.add(
      new BibTeXEntry(BibTeXType.Misc, {
        key: 'Note',
        note: `Citing ${registrations.length} out of a total of ${totalNumberOfRegistrations} registrations.'`,
      })
    );
  }

  downloadBibTexFile(database);
};

function downloadBibTexFile(database: BibTeXDatabase) {
  const blob = new Blob([database.toString()], { type: 'application/x-bibtex' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'registrations.bib';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
