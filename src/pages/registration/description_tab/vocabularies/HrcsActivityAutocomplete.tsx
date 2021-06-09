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

export const HrcsActivityAutocomplete = () => {
  const { t } = useTranslation('registration');

  const hrcsActivityOptions = hrcsActivities.categories
    .map((category) => [category, ...(category.subcategories ?? [])])
    .flat();

  return (
    <Autocomplete
      id="hrcs-activities"
      aria-labelledby="hrcs-activities-label"
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
