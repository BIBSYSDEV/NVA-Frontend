import { TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components';
import { hrcsData } from '../../../resources/vocabularies/hrcs';
import { hrcsHealthData } from '../../../resources/vocabularies/hrcsHealth';
import { getLanguageString } from '../../../utils/translation-helpers';

const StyledOptionText = styled(Typography)<{ indents: number }>`
  ${({ indents }) => `
    padding-left: ${indents * 1.5}rem;
    font-weight: ${indents === 0 ? 500 : 400};
    `}
`;

export const VocabularyField = () => {
  const hrcsOptions = hrcsData.categories.map((c) => [c, ...(c.subcategories ?? [])]).flat();
  const hrcsHealthOptions = hrcsHealthData.categories;

  return (
    <>
      <Autocomplete
        id="hrcs1"
        options={hrcsOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        renderOption={(option) => {
          const indentsCount = option.identifier.split('.').length - 1;
          return <StyledOptionText indents={indentsCount}>{getLanguageString(option.label)}</StyledOptionText>;
        }}
        multiple
        renderInput={(params) => <TextField {...params} label="HRCS Activity" variant="filled" />}
      />
      <Autocomplete
        id="hrcs2"
        options={hrcsHealthOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        multiple
        renderInput={(params) => <TextField {...params} label="HRCS Health" variant="filled" />}
      />
    </>
  );
};
