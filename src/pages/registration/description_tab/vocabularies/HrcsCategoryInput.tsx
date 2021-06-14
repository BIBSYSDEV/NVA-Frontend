import { useTranslation } from 'react-i18next';
import { VocabularyAutocomplete, VocabularyComponentProps } from './VocabularyAutocomplete';
import { hrcsCategories } from '../../../../resources/vocabularies/hrcsCategories';

export const HrcsCategoryInput = (props: VocabularyComponentProps) => {
  const { t } = useTranslation('registration');

  return (
    <VocabularyAutocomplete
      {...props}
      options={hrcsCategories.categories}
      id="hrcs-categories"
      label={t('description.hrcs_categories')}
    />
  );
};
