import { Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { hrcsActivities } from '../../../resources/vocabularies/hrcsActivities';
import { hrcsCategories } from '../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../utils/translation-helpers';

const StyledTextField = styled(TextField)`
  width: 15rem;
  margin-bottom: 1rem;
`;

const StyledOptionText = styled(Typography)<{ indentations: number }>`
  ${({ indentations }) => `
    padding-left: ${indentations * 1.5}rem;
    font-weight: ${indentations === 0 ? 500 : 400};
    `}
`;

enum Vocabulary {
  HrcsActivity = 'hrcsActivity',
  HrcsCategory = 'hrcsCategory',
}

export const VocabularyField = () => {
  const { t } = useTranslation('registration');

  const [showNewVocabularyDropdown, setShowNewVocabularyDropdown] = useState(false);

  const [visibleVocabularies, setVisibleVocabularies] = useState({
    [Vocabulary.HrcsActivity]: false,
    [Vocabulary.HrcsCategory]: false,
  });

  const addableVocabularies = Object.values(Vocabulary).filter((vocabulary) => !visibleVocabularies[vocabulary]);

  return (
    <>
      {visibleVocabularies.hrcsActivity && <HrcsActivityAutocomplete />}
      {visibleVocabularies.hrcsCategory && <HrcsCategoryAutocomplete />}

      {showNewVocabularyDropdown && (
        <StyledTextField
          variant="filled"
          defaultValue=""
          label="Velg vokabular"
          select
          onChange={(event) => {
            const selectedVocabulary = event.target.value;
            setVisibleVocabularies({ ...visibleVocabularies, [selectedVocabulary]: true });
            setShowNewVocabularyDropdown(false);
          }}>
          {addableVocabularies.map((vocabulary) => (
            <MenuItem key={vocabulary} value={vocabulary}>
              {vocabulary}
            </MenuItem>
          ))}
        </StyledTextField>
      )}
      <br />
      {addableVocabularies.length > 0 && !showNewVocabularyDropdown && (
        <Button variant="outlined" onClick={() => setShowNewVocabularyDropdown(true)}>
          Legg til vokabular
        </Button>
      )}
    </>
  );
};

const HrcsActivityAutocomplete = () => {
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

const HrcsCategoryAutocomplete = () => {
  const { t } = useTranslation('registration');

  const hrcsCategoryOptions = hrcsCategories.categories;

  return (
    <Autocomplete
      id="hrcs-categories"
      aria-labelledby="hrcs-categories-label"
      options={hrcsCategoryOptions}
      getOptionLabel={(option) => getLanguageString(option.label)}
      multiple
      renderInput={(params) => <TextField {...params} label={t('description.hrcs_categories')} variant="filled" />}
    />
  );
};
