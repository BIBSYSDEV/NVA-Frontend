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

interface ImportContributorWithFormValue {
  importContributor: ImportContributor;
  contributor?: Contributor;
}

export const pairContributors = (
  importContributors: ImportContributor[],
  formContributors: Contributor[]
): ImportContributorWithFormValue[] => {
  return importContributors.map((importContributor) => {
    const match = formContributors.find((contributor) => contributor.sequence === importContributor.sequence);

    return {
      importContributor,
      contributor: match,
    };
  });
};

export const contributorFromCristinPerson = (oldContributor: Contributor, selected: CristinPerson): Contributor => {
  const identity: Identity = {
    type: 'Identity',
    id: selected.id,
    name: getFullCristinName(selected.names),
    orcId: getOrcidUri(selected.identifiers),
    verificationStatus: getVerificationStatus(selected.verified),
    additionalIdentifiers: oldContributor.identity.additionalIdentifiers,
  };

  const affiliations = selected.affiliations;
  const newAffiliations: Affiliation[] = affiliations.map(({ organization }) => ({
    type: 'Organization',
    id: organization,
  }));

  return {
    ...oldContributor,
    identity,
    affiliations: newAffiliations,
  };
};

export const replaceExistingContributor = (
  values: Registration,
  setFieldValue: (field: string, value: unknown) => void,
  selected: CristinPerson,
  sequence: number
): void => {
  const current = values.entityDescription?.contributors ?? [];
  const index = current.findIndex((c) => c.sequence === sequence);
  if (index === -1) return;

  const old = current[index];
  const updated = contributorFromCristinPerson(old, selected);

  const next = [...current];
  next[index] = updated;

  setFieldValue('entityDescription.contributors', next);
};
