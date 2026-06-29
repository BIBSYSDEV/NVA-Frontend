import { ParseKeys } from 'i18next';

/** Formats fetched page-by-page via the link:rel="next" loop, then combined into one Blob. */
export interface PaginatedExportFormat {
  id: string;
  label: string;
  accept: string;
  mimeType: string;
  fileExtension: string;
  progressTitleKey: ParseKeys;
  combine: (chunks: string[]) => string;
}

/** Drop the first line (the CSV header row) from a chunk; returns '' if there is nothing after it. */
const dropFirstLine = (text: string): string => {
  const newlineIndex = text.indexOf('\n');
  return newlineIndex === -1 ? '' : text.slice(newlineIndex + 1);
};

const combineCsvChunks = (chunks: string[]): string => {
  const [first, ...rest] = chunks.map((chunk) => chunk.trimEnd()).filter(Boolean);
  if (!first) {
    return '';
  }
  return [first, ...rest.map(dropFirstLine)].filter(Boolean).join('\n');
};

export const bibtexExportFormat: PaginatedExportFormat = {
  id: 'bibtex',
  label: 'BibTex',
  accept: 'text/x-bibtex',
  mimeType: 'text/x-bibtex',
  fileExtension: 'bib',
  progressTitleKey: 'exporting_bibtex',
  combine: (chunks) => chunks.join('\n'),
};

export const csvExportFormat: PaginatedExportFormat = {
  id: 'csv',
  label: 'CSV',
  accept: 'text/csv',
  mimeType: 'text/csv',
  fileExtension: 'csv',
  progressTitleKey: 'exporting_csv',
  combine: combineCsvChunks,
};
