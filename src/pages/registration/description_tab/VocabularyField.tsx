import { TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { hrcsActivities } from '../../../resources/vocabularies/hrcsActivities';
import { hrcsCategories } from '../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../utils/translation-helpers';

const StyledOptionText = styled(Typography)<{ indents: number }>`
  ${({ indents }) => `
    padding-left: ${indents * 1.5}rem;
    font-weight: ${indents === 0 ? 500 : 400};
    `}
`;

export const VocabularyField = () => {
  const { t } = useTranslation('registration');
  const hrcsActivityOptions = hrcsActivities.categories.map((c) => [c, ...(c.subcategories ?? [])]).flat();
  const hrcsCategoryOptions = hrcsCategories.categories;

  return (
    <>
      <Autocomplete
        id="hrcs1"
        options={hrcsActivityOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        renderOption={(option) => {
          const indentsCount = option.identifier.split('.').length - 1;
          return <StyledOptionText indents={indentsCount}>{getLanguageString(option.label)}</StyledOptionText>;
        }}
        multiple
        renderInput={(params) => <TextField {...params} label={t('description.hrcs_activities')} variant="filled" />}
      />
      <Autocomplete
        id="hrcs2"
        options={hrcsCategoryOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        multiple
        renderInput={(params) => <TextField {...params} label={t('description.hrcs_categories')} variant="filled" />}
      />
    </>
  );
};
