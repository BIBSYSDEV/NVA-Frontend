import RuleIcon from '@mui/icons-material/Rule';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/PageWithSideMenu';
import { SelectableButton } from '../../../components/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { correctionListConfig, CorrectionListId, nviCorrectionListQueryKey } from './NviCorrectionList';

export const NviCorrectionListNavigationAccordion = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const selectedNviList = searchParams.get(nviCorrectionListQueryKey);

  const openNewCorrectionList = (newCorrectionListId: CorrectionListId) => {
    if (selectedNviList !== newCorrectionListId) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set(nviCorrectionListQueryKey, newCorrectionListId);
      const correctionListCategoryFilter = correctionListConfig[newCorrectionListId].queryParams.categoryShould;
      if (correctionListCategoryFilter && correctionListCategoryFilter.length > 0) {
        newSearchParams.set(ResultParam.CategoryShould, correctionListCategoryFilter.join(','));
      }
      const currentSearchSize = searchParams.get(ResultParam.Results);
      if (currentSearchSize) {
        newSearchParams.set(ResultParam.Results, currentSearchSize);
      }
      history.push({ search: newSearchParams.toString() });
    }
  };

  return (
    <NavigationListAccordion
      title={t('tasks.correction_list')}
      startIcon={<RuleIcon sx={{ bgcolor: 'white' }} />}
      accordionPath={UrlPathTemplate.TasksNviCorrectionList}
      defaultPath={`${UrlPathTemplate.TasksNviCorrectionList}?${nviCorrectionListQueryKey}=${
        'ApplicableCategoriesWithNonApplicableChannel' satisfies CorrectionListId
      }`}
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
          data-testid={dataTestId.tasksPage.correctionList.antologyWithoutChapterButton}
          isSelected={selectedNviList === 'AntologyWithoutChapter'}
          onClick={() => openNewCorrectionList('AntologyWithoutChapter')}>
          {t('tasks.nvi.correction_list_type.antology_without_chapter')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.booksWithLessThan50PagesButton}
          isSelected={selectedNviList === 'BooksWithLessThan50Pages'}
          onClick={() => openNewCorrectionList('BooksWithLessThan50Pages')}>
          {t('tasks.nvi.correction_list_type.book_with_less_than_50_pages')}
        </SelectableButton>
      </NavigationList>
    </NavigationListAccordion>
  );
};
