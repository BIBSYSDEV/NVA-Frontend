import { ListSubheader, TextField, Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { hrcsData } from '../../../resources/vocabularies/hrcs';
import { hrcsHealthData } from '../../../resources/vocabularies/hrcsHealth';
import { getLanguageString } from '../../../utils/translation-helpers';

export const VocabularyField = () => {
  const hrcsOptions = hrcsData.categories;
  const hrcsHealthOptions = hrcsHealthData.categories;

  return (
    <>
      <Autocomplete
        id="box-1"
        options={hrcsOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        multiple
        renderInput={(params) => <TextField {...params} label="HRCS Activity" variant="filled" />}
      />

      <Autocomplete
        id="box-2"
        options={hrcsHealthOptions}
        getOptionLabel={(option) => getLanguageString(option.label)}
        multiple
        renderInput={(params) => <TextField {...params} label="HRCS Health" variant="filled" />}
      />
    </>
  );
};
