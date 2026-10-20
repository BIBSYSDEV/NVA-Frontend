import { ResultParam } from '../api/searchApi';
import { DisabledCategory } from '../components/CategorySelector';
import { CorrectionListConfig, CorrectionListId, CorrectionListNames } from '../types/nvi.types';
import { allPublicationInstanceTypes } from '../types/publicationFieldNames';
import { PublicationInstanceType } from '../types/registration.types';
import { UrlPathTemplate } from './urlPaths';

export const nviCorrectionListQueryKey = 'list';

/**
 * Sets the publication year, and keeps {@link ResultParam.ExcludeParentPublicationYear} equal to it
 * for {@link CorrectionListNames.YearBetweenChapterAndBookMismatch}. That parameter removes hits
 * where the parent book has the given year, so the two being equal is what makes the search find
 * chapters from the selected year whose parent book is from another year.
 *
 * @param searchParams - The params to set the year on, mutated in place.
 * @param correctionListId - The list the year is being set for.
 * @param publicationYear - The year to filter on.
 */
export const setPublicationYearParams = (
  searchParams: URLSearchParams,
  correctionListId: CorrectionListId | null,
  publicationYear: string
) => {
  searchParams.set(ResultParam.PublicationYear, publicationYear);

  if (correctionListId === CorrectionListNames.YearBetweenChapterAndBookMismatch) {
    searchParams.set(ResultParam.ExcludeParentPublicationYear, publicationYear);
  } else {
    searchParams.delete(ResultParam.ExcludeParentPublicationYear);
  }
};

/**
 * Builds the search params a correction list should start out with, from the filters configured for
 * it. {@link nviCorrectionListQueryKey} and {@link ResultParam.PublicationYear} are always set, the
 * remaining filters only when the list is configured with them.
 *
 * @param correctionListConfig - The configuration for each correction list.
 * @param newCorrectionListId - The list to build search params for.
 * @param publicationYear - The year every correction list starts out filtering on.
 * @returns The search params to navigate to, without any pagination.
 */
export const getCorrectionListSearchParams = (
  correctionListConfig: CorrectionListConfig,
  newCorrectionListId: CorrectionListId,
  publicationYear: string
) => {
  const newSearchParams = new URLSearchParams();

  newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
  setPublicationYearParams(newSearchParams, newCorrectionListId, publicationYear);

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

  return newSearchParams;
};

/**
 * The path the correction list accordion links to, which opens the first list
 * ({@link CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel}) with its filters
 * already applied.
 *
 * @param correctionListConfig - The configuration for each correction list.
 * @param publicationYear - The year every correction list starts out filtering on.
 * @returns A path including search params, ready to navigate to.
 */
export const getAccordionDefaultPath = (
  correctionListConfig: CorrectionListConfig,
  publicationYear: string
): string => {
  return `${UrlPathTemplate.TasksNviCorrectionList}?${getCorrectionListSearchParams(
    correctionListConfig,
    CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel,
    publicationYear
  ).toString()}`;
};

/**
 * Creates the list of categories to disable in the category filter for a correction list.
 *
 * @param allowedTypes The publication instance types that should remain selectable.
 * @param text The tooltip text explaining why a category is disabled.
 * @returns Every publication instance type not in `allowedTypes`, each paired with `text`.
 */
export const getDisabledCategoriesOutside = (
  allowedTypes: PublicationInstanceType[],
  text: string
): DisabledCategory[] => {
  return allPublicationInstanceTypes.filter((type) => !allowedTypes.includes(type)).map((type) => ({ type, text }));
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
