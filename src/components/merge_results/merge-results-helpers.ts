import { Affiliation, Contributor } from '../../types/contributor.types';

const findMatchingContributor = (sourceContributor: Contributor, targetContributors: Contributor[]) => {
  return sourceContributor.identity.id
    ? targetContributors.find((c) => c.identity.id === sourceContributor.identity.id)
    : targetContributors.find((c) => c.identity.name === sourceContributor.identity.name);
};

const isAffiliationMissing = (sourceAffiliation: Affiliation, targetAffiliations: Affiliation[]) => {
  if (sourceAffiliation.type === 'Organization' && sourceAffiliation.id) {
    return !targetAffiliations.some((target) => target.type === 'Organization' && target.id === sourceAffiliation.id);
  }
  if (sourceAffiliation.type === 'UnconfirmedOrganization' && sourceAffiliation.name) {
    return !targetAffiliations.some(
      (target) => target.type === 'UnconfirmedOrganization' && target.name === sourceAffiliation.name
    );
  }
  return false;
};

export const mergeContributors = (sourceContributors: Contributor[], targetContributors: Contributor[]) => {
  return sourceContributors.reduce((acc, sourceContributor) => {
    const matchingTargetContributor = findMatchingContributor(sourceContributor, acc);

    if (!matchingTargetContributor) {
      return [...acc, sourceContributor];
    }

    const sourceAffiliations = sourceContributor.affiliations ?? [];
    const targetAffiliations = matchingTargetContributor.affiliations ?? [];
    const missingAffiliations = sourceAffiliations.filter((sourceAffiliation) =>
      isAffiliationMissing(sourceAffiliation, targetAffiliations)
    );

    return acc.map((contributor) =>
      contributor === matchingTargetContributor
        ? { ...contributor, affiliations: [...targetAffiliations, ...missingAffiliations] }
        : contributor
    );
  }, targetContributors);
};
