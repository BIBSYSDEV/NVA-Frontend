import { Autocomplete, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { hrcsCategories } from '../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../utils/translation-helpers';
import { hrcsActivityOptions } from '../../registration/description_tab/vocabularies/HrcsActivityInput';

const isHrcsActivity = (id: string) => id.includes('/hrcs/activity/');
const isHrcsCategory = (id: string) => id.includes('/hrcs/category/');
const options = [...hrcsCategories.categories, ...hrcsActivityOptions];

export const VocabularSearchField = () => {
  const { t } = useTranslation();

  return (
    <Autocomplete
      options={options}
      renderOption={({ key, ...props }, option) => {
        const indentsCount = option.cristinIdentifier.split('.').length - 1;
        return (
          <li {...props} key={option.id}>
            <Typography sx={{ pl: `${indentsCount * 1.5}rem`, fontWeight: indentsCount === 0 ? 500 : 400 }}>
              {getLanguageString(option.label)}
            </Typography>
          </li>
        );
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
          {...params}
          placeholder={t('search.select_vocabulary')}
          variant="outlined"
          showSearchIcon
        />
      )}
    />
  );
};
