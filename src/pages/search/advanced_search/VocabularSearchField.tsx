import { Autocomplete } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { HrcsActivityOption } from '../../../components/HrcsActivityAutocompleteOption';
import { hrcsCategories } from '../../../resources/vocabularies/hrcsCategories';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { hrcsActivityOptions } from '../../registration/description_tab/vocabularies/HrcsActivityInput';

const isHrcsActivity = (id: string) => id.includes('/hrcs/activity/');
const isHrcsCategory = (id: string) => id.includes('/hrcs/category/');
const options = [...hrcsCategories.categories, ...hrcsActivityOptions];

export const VocabularSearchField = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);

  const selectedVocabularyId = searchParams.get(ResultParam.Vocabulary);
  const selectedValue = selectedVocabularyId
    ? (options.find((option) => option.id === selectedVocabularyId) ?? null)
    : null;

  return (
    <Autocomplete
      options={options}
      value={selectedValue}
      renderOption={({ key, ...props }, option) => <HrcsActivityOption key={option.id} props={props} option={option} />}
      onChange={(_, value) => {
        if (value) {
          searchParams.set(ResultParam.Vocabulary, value.id);
        } else {
          searchParams.delete(ResultParam.Vocabulary);
        }
        history.push({ search: searchParams.toString() });
      }}
      getOptionLabel={(option) => getLanguageString(option.label)}
      groupBy={(option) =>
        isHrcsActivity(option.id)
          ? t('registration.description.hrcs_activities')
          : isHrcsCategory(option.id)
            ? t('registration.description.hrcs_categories')
            : t('common.unknown')
      }
      sx={{ minWidth: '15rem' }}
      size="small"
      renderInput={(params) => (
        <AutocompleteTextField
          data-testid={dataTestId.startPage.advancedSearch.vocabularyField}
          {...params}
          placeholder={t('search.select_vocabulary')}
          variant="outlined"
          showSearchIcon
        />
      )}
    />
  );
};