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

enum VocabularyType {
  HrcsActivity = 'hrcsActivity',
  HrcsCategory = 'hrcsCategory',
}

const vocabularyConfig = {
  [VocabularyType.HrcsActivity]: {
    i18nKey: 'hrcs_activities',
    component: HrcsActivityAutocomplete,
  },
  [VocabularyType.HrcsCategory]: {
    i18nKey: 'hrcs_categories',
    component: HrcsCategoryAutocomplete,
  },
};

export const VocabularyField = () => {
  const { t } = useTranslation('registration');
  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);
  const [visibleVocabularies, setVisibleVocabularies] = useState<VocabularyType[]>([]);

  const addableVocabularies = Object.values(VocabularyType).filter(
    (vocabulary) => !visibleVocabularies.includes(vocabulary)
  );

  return (
    <>
      {visibleVocabularies.map((vocabulary) => {
        const VocabularyInputComponent = vocabularyConfig[vocabulary].component;
        return (
          <StyledVocabularyRow key={vocabulary}>
            <VocabularyInputComponent />
            <DangerButton
              startIcon={<RemoveCircleIcon />}
              onClick={() => setVisibleVocabularies(visibleVocabularies.filter((v) => v !== vocabulary))}>
              {t('description.remove_vocabulary')}
            </DangerButton>
          </StyledVocabularyRow>
        );
      })}

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
                setVisibleVocabularies([...visibleVocabularies, vocabulary]);
                setNewVocabularyAnchor(null);
              }}>
              {t(`description.${vocabularyConfig[vocabulary].i18nKey}`)}
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
