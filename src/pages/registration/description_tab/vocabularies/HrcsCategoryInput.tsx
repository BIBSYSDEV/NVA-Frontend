import { useTranslation } from 'react-i18next';
import { hrcsCategories } from '../../../../resources/vocabularies/hrcsCategories';
import { VocabularyAutocomplete, VocabularyComponentProps } from './VocabularyAutocomplete';

export const HrcsCategoryInput = (props: VocabularyComponentProps) => {
  const { t } = useTranslation();

  return (
    <VocabularyAutocomplete
      {...props}
      options={hrcsCategories.categories}
      id="hrcs-categories"
      label={t('registration.description.hrcs_categories')}
    />
  );
};
