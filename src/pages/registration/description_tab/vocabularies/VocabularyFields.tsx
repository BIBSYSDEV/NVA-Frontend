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
import { dataTestId } from '../../../../utils/dataTestIds';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { Registration } from '../../../../types/registration.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';

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

export interface VocabularyComponentProps {
  selectedIds: string[];
  addValue: (value: string) => void;
  removeValue: () => void;
  clear: () => void;
}

interface VocabularyConfig {
  [key: string]: { baseId: string; i18nKey: string; component: (props: VocabularyComponentProps) => JSX.Element };
}

// Specify which vocabularies to show, and their i18n key and component
const vocabularyConfig: VocabularyConfig = {
  hrcsActivity: {
    baseId: 'https://nva.unit.no/hrcs/activity/',
    i18nKey: 'description.hrcs_activities',
    component: HrcsActivityAutocomplete,
  },
  hrcsCategory: {
    baseId: 'https://nva.unit.no/hrcs/category/',
    i18nKey: 'description.hrcs_categories',
    component: HrcsCategoryAutocomplete,
  },
};
const vocabularies = Object.keys(vocabularyConfig);

export const VocabularyFields = () => {
  const { t } = useTranslation('registration');
  const {
    setFieldValue,
    values: {
      entityDescription: { controlledKeywords },
    },
  } = useFormikContext<Registration>();

  // Open vacabularies with values by default
  const defaultVisibleVocabualaries = Object.entries(vocabularyConfig)
    .filter(([_, value]) => controlledKeywords.some((key) => key.startsWith(value.baseId)))
    .map(([key, _]) => key);
  const [visibleVocabularies, setVisibleVocabularies] = useState(defaultVisibleVocabualaries);
  const [vocabularyToRemove, setVocabularyToRemove] = useState('');
  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);

  const addableVocabularies = vocabularies.filter((vocabulary) => !visibleVocabularies.includes(vocabulary));

  return (
    <>
      <FieldArray name={DescriptionFieldNames.CONTROLLED_KEYWORDS}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            {visibleVocabularies.map((vocabulary, index) => {
              const VocabularyComponent = vocabularyConfig[vocabulary].component;
              const selectedIds = controlledKeywords.filter((keyword) =>
                keyword.startsWith(vocabularyConfig[vocabulary].baseId)
              );
              return (
                <StyledVocabularyRow
                  key={vocabulary}
                  data-testid={dataTestId.registrationWizard.description.vocabularyRow(vocabulary)}>
                  <VocabularyComponent
                    selectedIds={selectedIds}
                    addValue={push}
                    removeValue={() => remove(index)}
                    clear={() => setFieldValue(name, [])}
                  />
                  <StyledRemoveButton
                    startIcon={<RemoveCircleIcon />}
                    onClick={() => setVocabularyToRemove(vocabulary)}>
                    {t('description.remove_vocabulary')}
                  </StyledRemoveButton>
                </StyledVocabularyRow>
              );
            })}
          </>
        )}
      </FieldArray>

      {vocabularyToRemove && (
        <ConfirmDialog
          open={!!vocabularyToRemove}
          title={t('description.confirm_remove_vocabulary_title')}
          onAccept={() => {
            const { baseId } = vocabularyConfig[vocabularyToRemove];
            const updatedValues = controlledKeywords.filter((keyword) => !keyword.startsWith(baseId));
            setFieldValue(DescriptionFieldNames.CONTROLLED_KEYWORDS, updatedValues);

            setVisibleVocabularies(
              visibleVocabularies.filter((visibleVocabulary) => visibleVocabulary !== vocabularyToRemove)
            );
            setVocabularyToRemove('');
          }}
          onCancel={() => setVocabularyToRemove('')}>
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
              data-testid={dataTestId.registrationWizard.description.vocabularyMenuItem(vocabulary)}
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
        <StyledAddButton
          data-testid={dataTestId.registrationWizard.description.addVocabularyButton}
          onClick={(event) => setNewVocabularyAnchor(event.currentTarget)}
          startIcon={<AddIcon />}>
          {t('description.add_vocabulary')}
        </StyledAddButton>
      )}
    </>
  );
};
