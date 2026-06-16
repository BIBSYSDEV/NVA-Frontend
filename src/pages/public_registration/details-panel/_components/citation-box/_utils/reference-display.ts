import type { ReferenceFormat } from '../_components/ReferenceFormatToggle';

interface BibtexQueryState {
  data?: string;
  isLoading: boolean;
  isError: boolean;
}

export interface ReferenceDisplayState {
  citation: string;
  isLoading: boolean;
  isError: boolean;
  isCopyDisabled: boolean;
}

/**
 * Resolves what the reference box should show for the selected format. The BibTeX query state only
 * applies when BibTeX is selected; in plain-text mode the (synchronous) APA citation is used and no
 * loading/error state applies. Copying is disabled whenever there is no text to copy.
 */
export const getReferenceDisplayState = (
  format: ReferenceFormat,
  plainCitation: string,
  bibtex: BibtexQueryState
): ReferenceDisplayState => {
  const isBibtex = format === 'bibtex';
  const isLoading = isBibtex && bibtex.isLoading;
  const isError = isBibtex && bibtex.isError;
  const citation = isBibtex ? (bibtex.data ?? '') : plainCitation;

  return {
    citation,
    isLoading,
    isError,
    isCopyDisabled: isLoading || isError || !citation,
  };
};
