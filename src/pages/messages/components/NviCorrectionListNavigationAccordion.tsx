import RuleIcon from '@mui/icons-material/Rule';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/PageWithSideMenu';
import { SelectableButton } from '../../../components/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { correctionListConfig, CorrectionListId, nviCorrectionListQueryKey } from './NviCorrectionList';

const getCorrectionListParams = (newCorrectionListId: CorrectionListId) => {
  const newSearchParams = new URLSearchParams();
  newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
  const correctionListCategoryFilter = correctionListConfig[newCorrectionListId].queryParams.categoryShould;
  if (correctionListCategoryFilter && correctionListCategoryFilter.length > 0) {
    newSearchParams.set(ResultParam.CategoryShould, correctionListCategoryFilter.join(','));
  }
  return newSearchParams;
};

export const NviCorrectionListNavigationAccordion = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNviList = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;

  const openNewCorrectionList = (newCorrectionListId: CorrectionListId) => {
    if (selectedNviList !== newCorrectionListId) {
      const correctionListSearchParams = getCorrectionListParams(newCorrectionListId);
      const currentSearchSize = searchParams.get(ResultParam.Results);
      if (currentSearchSize) {
        correctionListSearchParams.set(ResultParam.Results, currentSearchSize);
      }
      setSearchParams(correctionListSearchParams);
    }
  };

  return (
    <NavigationListAccordion
      title={t('tasks.correction_list')}
      startIcon={<RuleIcon sx={{ bgcolor: 'white' }} />}
      accordionPath={UrlPathTemplate.TasksNviCorrectionList}
      defaultPath={`${UrlPathTemplate.TasksNviCorrectionList}?${getCorrectionListParams(
        'ApplicableCategoriesWithNonApplicableChannel'
      ).toString()}`}
      dataTestId={dataTestId.tasksPage.correctionList.correctionListAccordion}>
      <NavigationList component="div">
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.applicableCategoriesWithNonApplicableChannelButton}
          isSelected={selectedNviList === 'ApplicableCategoriesWithNonApplicableChannel'}
          onClick={() => openNewCorrectionList('ApplicableCategoriesWithNonApplicableChannel')}>
          {t('tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.nonApplicableCategoriesWithApplicableChannelButton}
          isSelected={selectedNviList === 'NonApplicableCategoriesWithApplicableChannel'}
          onClick={() => openNewCorrectionList('NonApplicableCategoriesWithApplicableChannel')}>
          {t('tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.anthologyWithoutChapterButton}
          isSelected={selectedNviList === 'AnthologyWithoutChapter'}
          onClick={() => openNewCorrectionList('AnthologyWithoutChapter')}>
          {t('tasks.nvi.correction_list_type.anthology_without_chapter')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.anthologyWithApplicableChapterButton}
          isSelected={selectedNviList === 'AnthologyWithApplicableChapter'}
          onClick={() => openNewCorrectionList('AnthologyWithApplicableChapter')}>
          {t('tasks.nvi.correction_list_type.anthology_with_applicable_chapter')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.booksWithLessThan50PagesButton}
          isSelected={selectedNviList === 'BooksWithLessThan50Pages'}
          onClick={() => openNewCorrectionList('BooksWithLessThan50Pages')}>
          {t('tasks.nvi.correction_list_type.book_with_less_than_50_pages')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.unidentifiedContributorWithIdentifiedAffiliationButton}
          isSelected={selectedNviList === 'UnidentifiedContributorWithIdentifiedAffiliation'}
          onClick={() => openNewCorrectionList('UnidentifiedContributorWithIdentifiedAffiliation')}>
          {t('tasks.nvi.correction_list_type.unidentified_contributor_with_identified_affiliation')}
        </SelectableButton>
      </NavigationList>
    </NavigationListAccordion>
  );
};
