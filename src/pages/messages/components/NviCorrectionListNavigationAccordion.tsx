import RuleIcon from '@mui/icons-material/Rule';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/PageWithSideMenu';
import { SelectableButton } from '../../../components/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { CorrectionListId, nviCorrectionListQueryKey } from './NviCorrectionList';

export const NviCorrectionListNavigationAccordion = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedNviList = searchParams.get(nviCorrectionListQueryKey);

  return (
    <NavigationListAccordion
      title={t('tasks.correction_list')}
      startIcon={<RuleIcon sx={{ bgcolor: 'white' }} />}
      accordionPath={UrlPathTemplate.TasksNviCorrectionList}
      dataTestId={dataTestId.tasksPage.correctionList.correctionListAccordion}>
      <NavigationList component="div">
        <SelectableButton
          isSelected={!selectedNviList}
          onClick={() => history.push({ search: '' })}
          sx={{ mb: '1rem' }}>
          {t('tasks.nvi.correction_list_type.correction_list_duct')}
        </SelectableButton>

        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.applicableCategoriesWithNonApplicableChannelButton}
          isSelected={selectedNviList === 'ApplicableCategoriesWithNonApplicableChannel'}
          onClick={() => {
            if (selectedNviList !== 'ApplicableCategoriesWithNonApplicableChannel') {
              searchParams.set(
                nviCorrectionListQueryKey,
                'ApplicableCategoriesWithNonApplicableChannel' satisfies CorrectionListId
              );
              searchParams.delete(ResultParam.From);
              history.push({ search: searchParams.toString() });
            }
          }}>
          {t('tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.nonApplicableCategoriesWithApplicableChannelButton}
          isSelected={selectedNviList === 'NonApplicableCategoriesWithApplicableChannel'}
          onClick={() => {
            if (selectedNviList !== 'NonApplicableCategoriesWithApplicableChannel') {
              searchParams.set(
                nviCorrectionListQueryKey,
                'NonApplicableCategoriesWithApplicableChannel' satisfies CorrectionListId
              );
              searchParams.delete(ResultParam.From);
              history.push({ search: searchParams.toString() });
            }
          }}>
          {t('tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.antologyWithoutChapterButton}
          isSelected={selectedNviList === 'AntologyWithoutChapter'}
          onClick={() => {
            if (selectedNviList !== 'AntologyWithoutChapter') {
              searchParams.set(nviCorrectionListQueryKey, 'AntologyWithoutChapter' satisfies CorrectionListId);
              searchParams.delete(ResultParam.From);
              history.push({ search: searchParams.toString() });
            }
          }}>
          {t('tasks.nvi.correction_list_type.antology_without_chapter')}
        </SelectableButton>
        <SelectableButton
          data-testid={dataTestId.tasksPage.correctionList.booksWithLessThan50PagesButton}
          isSelected={selectedNviList === 'BooksWithLessThan50Pages'}
          onClick={() => {
            if (selectedNviList !== 'BooksWithLessThan50Pages') {
              searchParams.set(nviCorrectionListQueryKey, 'BooksWithLessThan50Pages' satisfies CorrectionListId);
              searchParams.delete(ResultParam.From);
              history.push({ search: searchParams.toString() });
            }
          }}>
          {t('tasks.nvi.correction_list_type.book_with_less_than_50_pages')}
        </SelectableButton>
      </NavigationList>
    </NavigationListAccordion>
  );
};
