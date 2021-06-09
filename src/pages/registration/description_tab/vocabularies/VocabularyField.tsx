import { Button, Menu, MenuItem } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HrcsActivityAutocomplete } from './HrcsActivityAutocomplete';
import { HrcsCategoryAutocomplete } from './HrcsCategoryAutocomplete';

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
