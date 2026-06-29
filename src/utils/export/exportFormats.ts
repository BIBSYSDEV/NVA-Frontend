import { ParseKeys } from 'i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { API_URL } from '../constants';

interface BaseExportFormat {
  /** Stable id, used as React key / dataTestId suffix. */
  id: string;
  /** Menu label (static, like today's "CSV" / "BibTex"). */
  label: string;
}

/** Formats fetched page-by-page via the link:rel="next" loop, then combined into one Blob. */
export interface PaginatedExportFormat extends BaseExportFormat {
  kind: 'paginated';
  /** Accept header sent on each page request. */
  accept: string;
  /** Blob MIME type. */
  mimeType: string;
  /** Download file extension, without the leading dot. */
  fileExtension: string;
  /** i18n key for the ProgressDialog title. */
  progressTitleKey: ParseKeys;
  /** Merge the raw page bodies into one valid document. */
  combine: (chunks: string[]) => string;
}

/** Formats handled server-side as a plain anchor download (no fetch loop). */
export interface DirectLinkExportFormat extends BaseExportFormat {
  kind: 'direct-link';
  /** Build the href the `<a download>` points at. */
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
