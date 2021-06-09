import { Button, Menu, MenuItem, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { hrcsActivities } from '../../../resources/vocabularies/hrcsActivities';
import { hrcsCategories } from '../../../resources/vocabularies/hrcsCategories';
import { getLanguageString } from '../../../utils/translation-helpers';

const StyledOptionText = styled(Typography)<{ indentations: number }>`
  ${({ indentations }) => `
    padding-left: ${indentations * 1.5}rem;
    font-weight: ${indentations === 0 ? 500 : 400};
    `}
`;

// Values should be similar to i18n keys
enum Vocabulary {
  HrcsActivity = 'hrcs_activities',
  HrcsCategory = 'hrcs_categories',
}

export const VocabularyField = () => {
  const { t } = useTranslation('registration');

  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);

  const [visibleVocabularies, setVisibleVocabularies] = useState({
    [Vocabulary.HrcsActivity]: false,
    [Vocabulary.HrcsCategory]: false,
  });

  const addableVocabularies = Object.values(Vocabulary).filter((vocabulary) => !visibleVocabularies[vocabulary]);

  return (
    <>
      {visibleVocabularies.hrcs_activities && <HrcsActivityAutocomplete />}
      {visibleVocabularies.hrcs_categories && <HrcsCategoryAutocomplete />}

      {newVocabularyAnchor && (
        <Menu
          anchorEl={newVocabularyAnchor}
          keepMounted
          open={Boolean(newVocabularyAnchor)}
          onClose={() => setNewVocabularyAnchor(null)}>
          {addableVocabularies.map((vocabulary) => (
            <MenuItem
              key={vocabulary}
              onClick={() => {
                setVisibleVocabularies({ ...visibleVocabularies, [vocabulary]: true });
                setNewVocabularyAnchor(null);
              }}>
              {t(`description.${vocabulary}`)}
            </MenuItem>
          ))}
        </Menu>
      )}

      {addableVocabularies.length > 0 && (
        <Button variant="outlined" onClick={(event) => setNewVocabularyAnchor(event.currentTarget)}>
          {t('description.add_vocabulary')}
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
