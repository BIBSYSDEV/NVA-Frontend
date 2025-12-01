import { ImportCandidate } from '../types/importCandidate.types';
import { emptyRegistration } from '../types/registration.types';

export const convertImportCandidateToSomething = (importCandidate: ImportCandidate | undefined) => {
  if (!importCandidate) {
    return null;
  }

  const candidateContributors = importCandidate.entityDescription?.contributors ?? [];

  const contributors = candidateContributors.map((contributor) => ({
    ...contributor,
    type: 'Contributor',
    affiliations: contributor.affiliations
      .filter((affiliation) => affiliation.targetOrganization)
      .map((affiliation) => {
        const targetOrg = affiliation.targetOrganization!;
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
      }),
  }));

  const registration = {
    ...emptyRegistration,
    ...importCandidate,
    entityDescription: {
      ...importCandidate.entityDescription,
      type: 'EntityDescription',
      contributors,
    },
  };

  console.log(registration);

  return registration;
};
