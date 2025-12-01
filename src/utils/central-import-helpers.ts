import { Affiliation, Contributor } from '../types/contributor.types';
import {
  ExpandedImportCandidate,
  ImportAffiliation,
  ImportCandidate,
  ImportContributor,
  ImportEntityDescription,
} from '../types/importCandidate.types';
import { BaseReference, emptyRegistration, EntityDescription } from '../types/registration.types';

const convertImportAffiliation = (importAffiliation: ImportAffiliation): Affiliation => {
  const targetOrg = importAffiliation.targetOrganization!;
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

interface EmptyPublicationInstance {
  type?: '';
}

export const emptyReference: BaseReference & {
  publicationInstance?: EmptyPublicationInstance;
  publicationContext?: { type?: '' };
} = {
  type: 'Reference',
  doi: '',
  publicationInstance: { type: '' },
  publicationContext: { type: '' },
};

const convertImportEntityDescription = (importDesc: ImportEntityDescription): EntityDescription => ({
  ...importDesc,
  type: 'EntityDescription',
  contributors: importDesc.contributors.map(convertImportContributor),
  reference: importDesc.reference
    ? {
        ...importDesc.reference,
        publicationInstance: (importDesc.reference as any).publicationInstance ?? { type: '' },
        publicationContext: (importDesc.reference as any).publicationContext ?? { type: '' },
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
