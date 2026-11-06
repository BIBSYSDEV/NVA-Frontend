import { ImportCandidateSummary, ImportStatus } from '../../types/importCandidate.types';
import { emptyJournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';

export const makeImportStatus = (overrides: Partial<ImportStatus> = {}): ImportStatus => ({
  candidateStatus: 'NOT_IMPORTED',
  ...overrides,
});

/**
 * Builds an import candidate summary. The publication instance defaults to an empty journal instance, since the union
 * has no neutral member and journal is the most common category.
 *
 * @param overrides Fields to override on the default summary.
 * @returns An import candidate summary that is safe to mutate.
 */
export const makeImportCandidateSummary = (
  overrides: Partial<ImportCandidateSummary> = {}
): ImportCandidateSummary => ({
  type: 'ImportCandidateSummary',
  id: '',
  createdDate: '',
  additionalIdentifiers: [],
  importStatus: makeImportStatus(),
  doi: '',
  publicationYear: '',
  mainTitle: '',
  totalContributors: 0,
  totalVerifiedContributors: 0,
  organizations: [],
  publicationInstance: structuredClone(emptyJournalPublicationInstance),
  contributors: [],
  ...overrides,
});
