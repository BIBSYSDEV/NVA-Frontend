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

const combineJsonLdChunks = (chunks: string[]): string => {
  const chunksAsJson = chunks.map((chunk) => JSON.parse(chunk));
  const allResults = chunksAsJson.flatMap((page) => page.itemListElement ?? []);

  /** Use metadata from initial page/chunk */
  const context = chunksAsJson[0]?.['@context'] ?? 'undefined';
  const type = chunksAsJson[0]?.['@type'] ?? 'undefined';
  const numberOfItems = chunksAsJson[0]?.['numberOfItems'] ?? 'undefined';

  const merged = {
    '@context': context,
    '@type': type,
    numberOfItems: numberOfItems,
    itemListElement: allResults,
  };
  return JSON.stringify(merged, null, 2);
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

export const jsonLdExportFormat: PaginatedExportFormat = {
  id: 'json-ld',
  label: 'JSON-LD',
  accept: 'application/vnd.schemaorg.ld+json',
  mimeType: 'application/vnd.schemaorg.ld+json',
  fileExtension: 'json',
  progressTitleKey: 'exporting_json_ld',
  combine: combineJsonLdChunks,
};
