import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { hrcsCategories } from '../../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { VocabularyComponentProps } from './VocabularyFields';

const hrcsCategoriesId = 'hrcs-categories';
const hrcsCategoriesLabel = `${hrcsCategoriesId}-label`;

export const HrcsCategoryAutocomplete = ({ selectedIds, addValue, removeValue, clear }: VocabularyComponentProps) => {
  const { t } = useTranslation('registration');

  const hrcsCategoryOptions = hrcsCategories.categories;
  const selectedOptions = hrcsCategoryOptions.filter((option) => selectedIds.includes(option.id));

  return (
    <Autocomplete
      id={hrcsCategoriesId}
      aria-labelledby={hrcsCategoriesLabel}
      options={hrcsCategoryOptions}
      value={selectedOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      onChange={(event, value, reason, selectedValue) => {
        if (reason === 'select-option' && selectedValue) {
          addValue(selectedValue.option.id);
        } else if (reason === 'remove-option' && selectedValue) {
          removeValue(selectedValue.option.id);
        } else if (reason === 'clear') {
          clear();
        }
      }}
      multiple
      renderInput={(params) => <TextField {...params} label={t('description.hrcs_categories')} variant="filled" />}
    />
  );
};
