import { useTranslation } from 'react-i18next';
import { HrcsActivityOption } from '../../../../components/HrcsActivityAutocompleteOption';
import { hrcsActivities } from '../../../../resources/vocabularies/hrcsActivities';
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
      renderOption={({ key, ...props }, option) => <HrcsActivityOption key={option.id} props={props} option={option} />}
    />
  );
};
