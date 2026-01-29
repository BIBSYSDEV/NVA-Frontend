import { useTranslation } from 'react-i18next';
import { fundingSourceIsNfr } from '../../pages/registration/description_tab/projects_field/projectHelpers';
import { Affiliation, Contributor } from '../../types/contributor.types';
import { Funding } from '../../types/registration.types';
import { UrlPathTemplate } from '../../utils/urlPaths';

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

export const checkIfFundingsAreIdentical = (sourceFunding: Funding, targetFunding: Funding) => {
  if (
    fundingSourceIsNfr(sourceFunding.source) &&
    fundingSourceIsNfr(targetFunding.source) &&
    sourceFunding.id === targetFunding.id
  ) {
    return true;
  }

  if (
    sourceFunding.source === targetFunding.source &&
    sourceFunding.identifier === targetFunding.identifier &&
    sourceFunding.fundingAmount?.amount === targetFunding.fundingAmount?.amount
  ) {
    return true;
  }

  return false;
};

export const checkIfContributorsAreIdentical = (sourceContributor: Contributor, targetContributor: Contributor) => {
  if (sourceContributor.identity.name === targetContributor.identity.name) {
    return true;
  }
  return false;
};

export const useDecideSaveButtonTextFromUrl = () => {
  const { t } = useTranslation();

  if (location.pathname.startsWith(UrlPathTemplate.BasicDataCentralImport)) {
    return t('common.import_and_view');
  } else if (location.pathname.startsWith(UrlPathTemplate.RegistrationLandingPage.split(':')[0])) {
    return t('common.merge_and_view');
  }
  return t('common.save_and_view');
};
