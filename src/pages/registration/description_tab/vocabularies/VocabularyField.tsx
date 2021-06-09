import { Button, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import DangerButton from '../../../../components/DangerButton';
import { HrcsActivityAutocomplete } from './HrcsActivityAutocomplete';
import { HrcsCategoryAutocomplete } from './HrcsCategoryAutocomplete';

const StyledAddButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledVocabularyRow = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  column-gap: 2rem;
  align-items: center;
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
      {visibleVocabularies.hrcs_activities && (
        <StyledVocabularyRow>
          <HrcsActivityAutocomplete />
          <DangerButton
            startIcon={<RemoveCircleIcon />}
            onClick={() => setVisibleVocabularies({ ...visibleVocabularies, [Vocabulary.HrcsActivity]: false })}>
            {t('description.remove_vocabulary')}
          </DangerButton>
        </StyledVocabularyRow>
      )}
      {visibleVocabularies.hrcs_categories && (
        <StyledVocabularyRow>
          <HrcsCategoryAutocomplete />
          <DangerButton
            startIcon={<RemoveCircleIcon />}
            onClick={() => setVisibleVocabularies({ ...visibleVocabularies, [Vocabulary.HrcsCategory]: false })}>
            {t('description.remove_vocabulary')}
          </DangerButton>
        </StyledVocabularyRow>
      )}

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
        <StyledAddButton onClick={(event) => setNewVocabularyAnchor(event.currentTarget)} startIcon={<AddIcon />}>
          {t('description.add_vocabulary')}
        </StyledAddButton>
      )}
    </>
  );
};
