import { ParseKeys } from 'i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { API_URL } from '../constants';

interface BaseExportFormat {
  id: string;
  label: string;
}

/** Formats fetched page-by-page via the link:rel="next" loop, then combined into one Blob. */
export interface PaginatedExportFormat extends BaseExportFormat {
  kind: 'paginated';
  accept: string;
  mimeType: string;
  fileExtension: string;
  progressTitleKey: ParseKeys;
  combine: (chunks: string[]) => string;
}

/** Formats handled server-side as a plain anchor download (no fetch loop). */
export interface DirectLinkExportFormat extends BaseExportFormat {
  kind: 'direct-link';
  buildHref: (searchParams: URLSearchParams) => string;
}

export type ResultExportFormat = PaginatedExportFormat | DirectLinkExportFormat;

export const bibtexExportFormat: PaginatedExportFormat = {
  kind: 'paginated',
  id: 'bibtex',
  label: 'BibTex',
  accept: 'text/x-bibtex',
  mimeType: 'text/x-bibtex',
  fileExtension: 'bib',
  progressTitleKey: 'exporting_bibtex',
  combine: (chunks) => chunks.join('\n'),
};

export const csvExportFormat: DirectLinkExportFormat = {
  kind: 'direct-link',
  id: 'csv',
  label: 'CSV',
  buildHref: (searchParams) =>
    `${API_URL.replace(/\/$/, '')}${SearchApiPath.RegistrationsExport}?${searchParams.toString()}`,
};
