import { Contributor } from '../../types/contributor.types';

export const mergeContributors = (sourceContributors: Contributor[], targetContributors: Contributor[]) => {
  const mergedContributors = sourceContributors.reduce((acc, sourceContributor) => {
    const correspondingTargetContributor = sourceContributor.identity.id
      ? acc.find((targetContributor) => targetContributor.identity.id === sourceContributor.identity.id)
      : acc.find((targetContributor) => targetContributor.identity.name === sourceContributor.identity.name);

    if (!correspondingTargetContributor) {
      return [...acc, sourceContributor];
    }

    // Find affiliations from source that are not in target
    const allSourceAffiliations = sourceContributor.affiliations ?? [];
    const affiliationsToAdd = allSourceAffiliations.filter((sourceAffiliation) => {
      if (sourceAffiliation.type === 'Organization' && sourceAffiliation.id) {
        return !correspondingTargetContributor.affiliations?.some(
          (targetAffiliation) =>
            targetAffiliation.type === 'Organization' && targetAffiliation.id === sourceAffiliation.id
        );
      } else if (sourceAffiliation.type === 'UnconfirmedOrganization' && sourceAffiliation.name) {
        return !correspondingTargetContributor.affiliations?.some(
          (targetAffiliation) =>
            targetAffiliation.type === 'UnconfirmedOrganization' && targetAffiliation.name === sourceAffiliation.name
        );
      }
      return false;
    });

    // Update the corresponding target contributor with merged affiliations
    return acc.map((contributor) =>
      contributor === correspondingTargetContributor
        ? {
            ...contributor,
            affiliations: [...(contributor.affiliations ?? []), ...affiliationsToAdd],
          }
        : contributor
    );
  }, targetContributors);

  return mergedContributors;
};
