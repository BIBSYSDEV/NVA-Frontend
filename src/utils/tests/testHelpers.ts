import { AssociatedFile, emptyFile, FileType } from '../../types/associatedArtifact.types';
import { Contributor, ContributorRole, Identity } from '../../types/contributor.types';
import { CristinPerson, CristinPersonAffiliation, Employment } from '../../types/user.types';

/**
 * Builds a file the user may edit the metadata of, which is the case most tests start from.
 * @param overrides Fields to set on top of {@link emptyFile}.
 */
export const buildFile = (overrides: Partial<AssociatedFile> = {}): AssociatedFile => ({
  ...emptyFile,
  type: FileType.OpenFile,
  allowedOperations: ['write-metadata'],
  ...overrides,
});

/**
 * Builds a file the user may not edit, the way a published file reaches a registrator.
 * @param overrides Fields to set on top of the locked file.
 */
export const buildLockedFile = (overrides: Partial<AssociatedFile> = {}): AssociatedFile =>
  buildFile({ allowedOperations: ['download'], ...overrides });

export const buildIdentity = (overrides: Partial<Identity> = {}): Identity => ({
  type: 'Identity',
  name: '',
  ...overrides,
});

export const buildContributor = (overrides: Partial<Contributor> = {}): Contributor => ({
  type: 'Contributor',
  affiliations: [],
  correspondingAuthor: false,
  identity: buildIdentity(),
  role: { type: ContributorRole.Creator },
  sequence: 1,
  ...overrides,
});

export const buildCristinPerson = (overrides: Partial<CristinPerson> = {}): CristinPerson => ({
  id: '',
  affiliations: [],
  employments: [],
  background: {},
  identifiers: [],
  names: [],
  ...overrides,
});

export const buildEmployment = (overrides: Partial<Employment> = {}): Employment => ({
  type: '',
  organization: '',
  startDate: '',
  endDate: '',
  fullTimeEquivalentPercentage: '',
  ...overrides,
});

export const buildAffiliation = (overrides: Partial<CristinPersonAffiliation> = {}): CristinPersonAffiliation => ({
  active: true,
  organization: '',
  role: {
    labels: { no: 'Ansatt', en: 'Employee' },
  },
  ...overrides,
});
