import { ResultParam } from '../api/searchApi';
import {
  CommonCorrectionListConfig,
  CorrectionListId,
  CorrectionListNames,
  CorrectionListSearchConfig,
  nviCorrectionListQueryKey,
} from '../types/nvi.types';
import { getDefaultNviYear } from './nviHelpers';
import { UrlPathTemplate } from './urlPaths';

/**
 * The filters every correction list starts out with.
 *
 * @returns The common configuration, with the publication year defaulting to the current NVI year.
 */
export const getCommonCorrectionListConfig = (): CommonCorrectionListConfig => ({
  publicationYear: getDefaultNviYear().toString(),
});

/**
 * Builds the search params a correction list should start out with, from the filters configured for
 * it. {@link nviCorrectionListQueryKey} and {@link ResultParam.PublicationYear} are always set, the
 * remaining filters only when the list is configured with them.
 *
 * @param correctionListConfig - The configuration for each correction list.
 * @param newCorrectionListId - The list to build search params for.
 * @param commonConfig - The filters shared by all correction lists.
 * @returns The search params to navigate to, without any pagination.
 */
export const getCorrectionListSearchParams = (
  correctionListConfig: CorrectionListSearchConfig,
  newCorrectionListId: CorrectionListId,
  commonConfig: CommonCorrectionListConfig
) => {
  const { publicationYear } = commonConfig;
  const newSearchParams = new URLSearchParams();

  newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
  newSearchParams.set(ResultParam.PublicationYear, publicationYear);

  const { queryParams, topLevelOrganization } = correctionListConfig[newCorrectionListId];
  const { scientificValue, categoryShould, unidentifiedContributorInstitution } = queryParams;

  if (categoryShould && categoryShould.length > 0) {
    newSearchParams.set(ResultParam.CategoryShould, categoryShould.join(','));
  }

  if (topLevelOrganization) {
    newSearchParams.set(ResultParam.TopLevelOrganization, topLevelOrganization);
  }

  if (scientificValue) {
    newSearchParams.set(ResultParam.ScientificValue, scientificValue);
  }

  if (unidentifiedContributorInstitution) {
    newSearchParams.set(ResultParam.UnidentifiedContributorInstitution, unidentifiedContributorInstitution);
  }

  if (newCorrectionListId === CorrectionListNames.YearBetweenChapterAndBookMismatch) {
    // NOTE: excludeParentPublicationYear removes hits where the parent book has the given year.
    // We use it to find chapters from the selected year whose parent book is from another year
    newSearchParams.set(ResultParam.ExcludeParentPublicationYear, publicationYear);
  }

  return newSearchParams;
};

/**
 * The path the correction list accordion links to, which opens the first list
 * ({@link CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel}) with its filters
 * already applied.
 *
 * @param correctionListConfig - The configuration for each correction list.
 * @param commonConfig - The filters shared by all correction lists.
 * @returns A path including search params, ready to navigate to.
 */
export const getAccordionDefaultPath = (
  correctionListConfig: CorrectionListSearchConfig,
  commonConfig: CommonCorrectionListConfig
): string => {
  return `${UrlPathTemplate.TasksNviCorrectionList}?${getCorrectionListSearchParams(
    correctionListConfig,
    CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel,
    commonConfig
  ).toString()}`;
};

/**
 * Type guard for narrowing an unvalidated string, such as a value read from the URL, to a known
 * correction list name.
 *
 * @param value - The string to check.
 * @returns Whether the value is one of the {@link CorrectionListNames}.
 */
export const isCorrectionListName = (value: string): value is CorrectionListNames => {
  return Object.values(CorrectionListNames).includes(value as CorrectionListNames);
};
