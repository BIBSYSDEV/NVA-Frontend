import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hrcsActivities } from '../../../../resources/vocabularies/hrcsActivities';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { VocabularyAutocomplete, VocabularyComponentProps } from './VocabularyAutocomplete';

export const hrcsActivityOptions = hrcsActivities.categories
  .map((category) => {
    const { subcategories, ...mainCategory } = category;
    const subCategories = category.subcategories ?? [];
    return [mainCategory, ...subCategories];
  })
  .flat();

export const HrcsActivityInput = (props: VocabularyComponentProps) => {
  const { t } = useTranslation();

  return (
    <VocabularyAutocomplete
      {...props}
      options={hrcsActivityOptions}
      id="hrcs-activities"
      label={t('registration.description.hrcs_activities')}
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
    />
  );
};
