import { Affiliation, Contributor } from '../types/contributor.types';
import {
  ExpandedImportCandidate,
  ImportAffiliation,
  ImportCandidate,
  ImportContributor,
  ImportEntityDescription,
} from '../types/importCandidate.types';
import { emptyReference, emptyRegistration, EntityDescription } from '../types/registration.types';

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
