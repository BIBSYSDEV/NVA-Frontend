import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { hrcsCategories } from '../../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../../utils/translation-helpers';

const hrcsCategoriesId = 'hrcs-categories';
const hrcsCategoriesLabel = `${hrcsCategoriesId}-label`;

export const HrcsCategoryAutocomplete = () => {
  const { t } = useTranslation('registration');

  const hrcsCategoryOptions = hrcsCategories.categories;

  return (
    <Autocomplete
      id={hrcsCategoriesId}
      aria-labelledby={hrcsCategoriesLabel}
      options={hrcsCategoryOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      multiple
      renderInput={(params) => <TextField {...params} label={t('description.hrcs_categories')} variant="filled" />}
    />
  );
};
