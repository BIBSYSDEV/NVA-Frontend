import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { hrcsActivities } from '../../../../resources/vocabularies/hrcsActivities';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { VocabularyAutocomplete, VocabularyComponentProps } from './VocabularyAutocomplete';

const StyledOptionText = styled(Typography)<{ indentations: number }>`
  ${({ indentations }) => `
    padding-left: ${indentations * 1.5}rem;
    font-weight: ${indentations === 0 ? 500 : 400};
    `}
`;

export const hrcsActivityOptions = hrcsActivities.categories
  .map((category) => {
    const { subcategories, ...mainCategory } = category;
    const subCategories = category.subcategories ?? [];
    return [mainCategory, ...subCategories];
  })
  .flat();

export const HrcsActivityInput = (props: VocabularyComponentProps) => {
  const { t } = useTranslation('registration');

  return (
    <VocabularyAutocomplete
      {...props}
      options={hrcsActivityOptions}
      id="hrcs-activities"
      label={t('description.hrcs_activities')}
      renderOption={(props, option) => {
        const indentsCount = option.identifier.split('.').length - 1;
        return <StyledOptionText indentations={indentsCount}>{getLanguageString(option.label)}</StyledOptionText>;
      }}
    />
  );
};
