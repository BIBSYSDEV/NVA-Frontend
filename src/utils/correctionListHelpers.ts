import { ResultParam } from '../api/searchApi';
import { nviCorrectionListQueryKey } from '../pages/messages/components/NviCorrectionList';
import { CorrectionListSearchConfig, CorrectionListId } from '../types/nvi.types';
import { UrlPathTemplate } from './urlPaths';

export const getCorrectionListSearchParams = (
  correctionListConfig: CorrectionListSearchConfig,
  newCorrectionListId: CorrectionListId
) => {
  const newSearchParams = new URLSearchParams();
  newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
  const correctionListCategoryFilter = correctionListConfig[newCorrectionListId].queryParams.categoryShould;
  const correctionListTopLevelOrgFilter = correctionListConfig[newCorrectionListId].topLevelOrganization;
  if (correctionListCategoryFilter && correctionListCategoryFilter.length > 0) {
    newSearchParams.set(ResultParam.CategoryShould, correctionListCategoryFilter.join(','));
  }

  if (correctionListTopLevelOrgFilter) {
    newSearchParams.set(ResultParam.TopLevelOrganization, correctionListTopLevelOrgFilter);
  }
  newSearchParams.set(ResultParam.PublicationYear, (new Date().getFullYear() - 1).toString());
  return newSearchParams;
};

export const getAccordionDefaultPath = (correctionListConfig: CorrectionListSearchConfig): string => {
  return `${UrlPathTemplate.TasksNviCorrectionList}?${getCorrectionListSearchParams(
    correctionListConfig,
    'ApplicableCategoriesWithNonApplicableChannel'
  ).toString()}`;
};
