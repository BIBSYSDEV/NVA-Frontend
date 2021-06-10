import { Button, Menu, MenuItem, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import DangerButton from '../../../../components/DangerButton';
import { HrcsActivityAutocomplete } from './HrcsActivityAutocomplete';
import { HrcsCategoryAutocomplete } from './HrcsCategoryAutocomplete';

const StyledAddButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledRemoveButton = styled(DangerButton)`
  margin-top: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin-top: 0.5rem;
  }
`;

const StyledVocabularyRow = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  column-gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

interface VocabularyConfig {
  [key: string]: { i18nKey: string; component: () => JSX.Element };
}

// Specify which vocabularies to show, and their i18n key and component
const vocabularyConfig: VocabularyConfig = {
  hrcsActivity: {
    i18nKey: 'description.hrcs_activities',
    component: HrcsActivityAutocomplete,
  },
  hrcsCategory: {
    i18nKey: 'description.hrcs_categories',
    component: HrcsCategoryAutocomplete,
  },
};
const vocabularies = Object.keys(vocabularyConfig);

export const VocabularyFields = () => {
  const { t } = useTranslation('registration');
  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);
  const [visibleVocabularies, setVisibleVocabularies] = useState<string[]>([]);
  const [vocabularyToRemove, setVocabularyToRemove] = useState('');

  const addableVocabularies = vocabularies.filter((vocabulary) => !visibleVocabularies.includes(vocabulary));

  return (
    <>
      {visibleVocabularies.map((vocabulary) => {
        const VocabularyInputComponent = vocabularyConfig[vocabulary].component;
        return (
          <StyledVocabularyRow key={vocabulary}>
            <VocabularyInputComponent />
            <StyledRemoveButton startIcon={<RemoveCircleIcon />} onClick={() => setVocabularyToRemove(vocabulary)}>
              {t('description.remove_vocabulary')}
            </StyledRemoveButton>
          </StyledVocabularyRow>
        );
      })}

      {vocabularyToRemove && (
        <ConfirmDialog
          open={!!vocabularyToRemove}
          title={t('description.confirm_remove_vocabulary_title')}
          onAccept={() => {
            setVisibleVocabularies(
              visibleVocabularies.filter((visibleVocabulary) => visibleVocabulary !== vocabularyToRemove)
            );
            setVocabularyToRemove('');
          }}
          onCancel={() => setVocabularyToRemove('')}
          dataTestId="confirm-remove-vocabulary-dialog">
          <Typography>
            {t('description.confirm_remove_vocabulary_text', {
              vocabulary: t(vocabularyConfig[vocabularyToRemove].i18nKey),
            })}
          </Typography>
        </ConfirmDialog>
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
                setVisibleVocabularies([...visibleVocabularies, vocabulary]);
                setNewVocabularyAnchor(null);
              }}>
              {t(vocabularyConfig[vocabulary].i18nKey)}
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
