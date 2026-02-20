import { ResultParam } from '../api/searchApi';
import { nviCorrectionListQueryKey } from '../pages/messages/components/NviCorrectionList';
import { CorrectionListId, CorrectionListSearchConfig } from '../types/nvi.types';
import { UrlPathTemplate } from './urlPaths';

export const getCorrectionListSearchParams = (
  correctionListConfig: CorrectionListSearchConfig,
  newCorrectionListId: CorrectionListId
) => {
  const newSearchParams = new URLSearchParams();
  newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
  const correctionListCategoryFilter = correctionListConfig[newCorrectionListId].queryParams.categoryShould;
  const correctionListTopLevelOrgFilter = correctionListConfig[newCorrectionListId].topLevelOrganization;
  const scientificValueFilter = correctionListConfig[newCorrectionListId].queryParams.scientificValue;
  const parentTypeFilter = correctionListConfig[newCorrectionListId].queryParams.parentType;
  if (correctionListCategoryFilter && correctionListCategoryFilter.length > 0) {
    newSearchParams.set(ResultParam.CategoryShould, correctionListCategoryFilter.join(','));
  }

  if (correctionListTopLevelOrgFilter) {
    newSearchParams.set(ResultParam.TopLevelOrganization, correctionListTopLevelOrgFilter);
  }

  if (scientificValueFilter) {
    newSearchParams.set(ResultParam.ScientificValue, scientificValueFilter);
  }

  if (parentTypeFilter) {
    newSearchParams.set(ResultParam.ParentType, parentTypeFilter.join(','));
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
