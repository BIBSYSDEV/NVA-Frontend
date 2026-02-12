import { Affiliation, Contributor, Identity } from '../types/contributor.types';
import {
  ExpandedImportCandidate,
  ImportAffiliation,
  ImportCandidate,
  ImportContributor,
  ImportEntityDescription,
} from '../types/importCandidate.types';
import { emptyReference, emptyRegistration, EntityDescription, Registration } from '../types/registration.types';
import { CristinPerson } from '../types/user.types';
import { getFullCristinName, getOrcidUri, getVerificationStatus } from './user-helpers';

const convertImportAffiliation = (importAffiliation: ImportAffiliation): Affiliation => {
  // NOTE:  Filtering happens in convertImportContributor.
  const targetOrg = importAffiliation.targetOrganization;
  if (!targetOrg) {
    throw new Error('targetOrganization is missing in importAffiliation');
  }

  if (targetOrg.type === 'Organization') {
    return {
      type: targetOrg.type,
      id: targetOrg.id,
    };
  } else if (targetOrg.type === 'UnconfirmedOrganization') {
    return {
      type: targetOrg.type,
      name: targetOrg.name,
    };
  }
  throw new Error('Unknown organization type');
};

const convertImportContributor = (importContributor: ImportContributor): Contributor => ({
  ...importContributor,
  type: 'Contributor',
  affiliations: importContributor.affiliations
    .filter((aff) => aff.targetOrganization)
    .map((aff) => convertImportAffiliation(aff)),
});

const convertImportEntityDescription = (importEntityDescription: ImportEntityDescription): EntityDescription => ({
  ...importEntityDescription,
  type: 'EntityDescription',
  contributors: importEntityDescription.contributors.map(convertImportContributor),
  reference: importEntityDescription.reference
    ? {
        ...importEntityDescription.reference,
        publicationInstance: (importEntityDescription.reference as any).publicationInstance ?? { type: '' },
        publicationContext: (importEntityDescription.reference as any).publicationContext ?? { type: '' },
      }
    : emptyReference,
});

export const expandImportCandidate = (importCandidate: ImportCandidate): ExpandedImportCandidate => {
  return {
    ...emptyRegistration,
    ...importCandidate,
    entityDescription: convertImportEntityDescription(importCandidate.entityDescription),
  };
};

export interface ImportContributorPair {
  importContributor: ImportContributor;
  contributor?: Contributor;
}

export const pairContributors = (
  importContributors: ImportContributor[],
  formContributors: Contributor[]
): ImportContributorPair[] => {
  return importContributors.map((importContributor) => {
    const match = formContributors.find((contributor) => contributor.sequence === importContributor.sequence);

    return {
      importContributor,
      contributor: match,
    };
  });
};

export const createIdentityFromCristinPerson = (oldIdentity: Identity, person: CristinPerson): Identity => {
  return {
    type: 'Identity',
    id: person.id,
    name: getFullCristinName(person.names),
    orcId: getOrcidUri(person.identifiers),
    verificationStatus: getVerificationStatus(person.verified),
    additionalIdentifiers: oldIdentity.additionalIdentifiers,
  };
};

export const getAffiliationsFromCristinPerson = (person: CristinPerson): Affiliation[] =>
  (person.affiliations ?? []).map(
    ({ organization }): Affiliation => ({
      type: 'Organization',
      id: organization,
    })
  );

const mergeAffiliations = (
  oldAffiliations: Affiliation[] | undefined,
  newAffiliations: Affiliation[]
): Affiliation[] => {
  const existing = oldAffiliations ?? [];
  const merged = [...existing];

  for (const newAff of newAffiliations) {
    if (
      newAff.type === 'Organization' &&
      newAff.id &&
      !existing.some((oldAff) => oldAff.type === 'Organization' && oldAff.id === newAff.id)
    ) {
      merged.push(newAff);
    }
  }

  return merged;
};

export const createContributorFromCristinPerson = (
  oldContributor: Contributor,
  selected: CristinPerson
): Contributor => {
  const updatedIdentity = createIdentityFromCristinPerson(oldContributor.identity, selected);
  const updatedAffiliations = getAffiliationsFromCristinPerson(selected);

  return {
    ...oldContributor,
    identity: updatedIdentity,
    affiliations: updatedAffiliations,
  };
};

export const replaceExistingContributorAndAffiliations = (
  values: Registration,
  setFieldValue: (field: string, value: unknown) => void,
  selected: CristinPerson,
  sequence: number
): void => {
  const currentContributors: Contributor[] = values.entityDescription?.contributors ?? [];

  const contributorIndex = currentContributors.findIndex((contributor) => contributor.sequence === sequence);
  if (contributorIndex === -1) return;

  const oldContributor = currentContributors[contributorIndex];

  const updatedIdentity = createIdentityFromCristinPerson(oldContributor.identity, selected);
  const newAffiliationsFromPerson = getAffiliationsFromCristinPerson(selected);
  const mergedAffiliations = mergeAffiliations(oldContributor.affiliations, newAffiliationsFromPerson);

  const updatedContributor: Contributor = {
    ...oldContributor,
    identity: updatedIdentity,
    affiliations: mergedAffiliations,
  };

  const updatedContributors = [...currentContributors];
  updatedContributors[contributorIndex] = updatedContributor;

  setFieldValue('entityDescription.contributors', updatedContributors);
};

export const replaceExistingContributor = (
  values: Registration,
  setFieldValue: (field: string, value: unknown) => void,
  selected: CristinPerson,
  sequence: number
): void => {
  const currentContributors: Contributor[] = values.entityDescription?.contributors ?? [];

  const contributorIndex = currentContributors.findIndex((contributor) => contributor.sequence === sequence);
  if (contributorIndex === -1) return;

  const oldContributor = currentContributors[contributorIndex];

  const updatedIdentity = createIdentityFromCristinPerson(oldContributor.identity, selected);

  const updatedContributor: Contributor = {
    ...oldContributor,
    identity: updatedIdentity,
    affiliations: oldContributor.affiliations,
  };

  const updatedContributors = [...currentContributors];
  updatedContributors[contributorIndex] = updatedContributor;

  setFieldValue('entityDescription.contributors', updatedContributors);
};
