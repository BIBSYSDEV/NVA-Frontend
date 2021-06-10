import { TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { hrcsActivities } from '../../../../resources/vocabularies/hrcsActivities';
import { getLanguageString } from '../../../../utils/translation-helpers';

const StyledOptionText = styled(Typography)<{ indentations: number }>`
  ${({ indentations }) => `
    padding-left: ${indentations * 1.5}rem;
    font-weight: ${indentations === 0 ? 500 : 400};
    `}
`;

const hrcsActivitiesId = 'hrcs-activities';
const hrcsActivitiesLabel = `${hrcsActivitiesId}-label`;

export const HrcsActivityAutocomplete = () => {
  const { t } = useTranslation('registration');

  const hrcsActivityOptions = hrcsActivities.categories
    .map((category) => {
      const { subcategories, ...mainCategory } = category;
      const subCategories = category.subcategories ?? [];
      return [mainCategory, ...subCategories];
    })
    .flat();

  return (
    <Autocomplete
      id={hrcsActivitiesId}
      aria-labelledby={hrcsActivitiesLabel}
      options={hrcsActivityOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      renderOption={(option) => {
        const indentsCount = option.identifier.split('.').length - 1;
        return <StyledOptionText indentations={indentsCount}>{getLanguageString(option.label)}</StyledOptionText>;
      }}
      multiple
      renderInput={(params) => <TextField {...params} label={t('description.hrcs_activities')} variant="filled" />}
    />
  );
};
