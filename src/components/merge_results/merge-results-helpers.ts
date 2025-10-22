import { Affiliation, Contributor } from '../../types/contributor.types';

const findMatchingContributor = (sourceContributor: Contributor, targetContributors: Contributor[]) =>
  sourceContributor.identity.id
    ? targetContributors.find((contributor) => contributor.identity.id === sourceContributor.identity.id)
    : targetContributors.find((contributor) => contributor.identity.name === sourceContributor.identity.name);

const isMissingAffiliation = (sourceAffiliation: Affiliation, targetAffiliations: Affiliation[]) => {
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
  const mergedContributors = sourceContributors.reduce((acc, sourceContributor) => {
    const matchingTargetContributor = findMatchingContributor(sourceContributor, acc);

    if (!matchingTargetContributor) {
      return [...acc, sourceContributor];
    }

    const sourceAffiliations = sourceContributor.affiliations ?? [];
    const targetAffiliations = matchingTargetContributor.affiliations ?? [];
    const missingAffiliations = sourceAffiliations.filter((sourceAffiliation) =>
      isMissingAffiliation(sourceAffiliation, targetAffiliations)
    );

    return acc.map((contributor) =>
      contributor === matchingTargetContributor
        ? { ...contributor, affiliations: [...targetAffiliations, ...missingAffiliations] }
        : contributor
    );
  }, targetContributors);

  return mergedContributors;
};
