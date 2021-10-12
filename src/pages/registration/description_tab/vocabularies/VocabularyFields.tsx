import { Button, Menu, MenuItem, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { HrcsActivityInput } from './HrcsActivityInput';
import { HrcsCategoryInput } from './HrcsCategoryInput';
import { dataTestId } from '../../../../utils/dataTestIds';
import { Registration } from '../../../../types/registration.types';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { VocabularyComponentProps } from './VocabularyAutocomplete';
import { hrcsActivityBaseId, hrcsCategoryBaseId } from '../../../../utils/constants';

const StyledAddButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledRemoveButton = styled(Button)`
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
  [key: string]: { baseId: string; i18nKey: string; component: (props: VocabularyComponentProps) => JSX.Element };
}

// Specify which vocabularies to show, and their i18n key and component
const vocabularyConfig: VocabularyConfig = {
  hrcsActivity: {
    baseId: hrcsActivityBaseId,
    i18nKey: 'description.hrcs_activities',
    component: HrcsActivityInput,
  },
  hrcsCategory: {
    baseId: hrcsCategoryBaseId,
    i18nKey: 'description.hrcs_categories',
    component: HrcsCategoryInput,
  },
};
const vocabularyEntries = Object.entries(vocabularyConfig);

interface VocabularyFieldsProps {
  defaultVocabularies: string[];
  allowedVocabularies: string[];
}

export const VocabularyFields = ({ defaultVocabularies, allowedVocabularies }: VocabularyFieldsProps) => {
  const { t } = useTranslation('registration');
  const {
    setFieldValue,
    values: { subjects },
  } = useFormikContext<Registration>();

  // Show fields for vocabularies that has a value, or has status Default
  const vocabulariesWithValue = vocabularyEntries
    .filter(([_, value]) => subjects.some((key) => key.startsWith(value.baseId)))
    .map(([key, _]) => key);
  const defaultVocabularyNames = vocabularyEntries
    .filter(([_, value]) => defaultVocabularies.includes(value.baseId))
    .map(([key, _]) => key);
  const allowedVocabularyNames = vocabularyEntries
    .filter(([_, value]) => allowedVocabularies.includes(value.baseId))
    .map(([key, _]) => key);

  const [visibleVocabularies, setVisibleVocabularies] = useState([
    ...new Set([...defaultVocabularyNames, ...vocabulariesWithValue]),
  ]);
  const [vocabularyToRemove, setVocabularyToRemove] = useState('');
  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);

  const addableVocabularies = allowedVocabularyNames.filter((vocabulary) => !visibleVocabularies.includes(vocabulary));

  return (
    <>
      <FieldArray name={DescriptionFieldNames.Subjects}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            {visibleVocabularies.map((vocabulary) => {
              const { baseId, component, i18nKey } = vocabularyConfig[vocabulary];
              const VocabularyComponent = component;
              const selectedIds = subjects.filter((keyword) => keyword.startsWith(baseId));

              return (
                <StyledVocabularyRow
                  key={vocabulary}
                  data-testid={dataTestId.registrationWizard.description.vocabularyRow(vocabulary)}>
                  <VocabularyComponent
                    selectedIds={selectedIds}
                    addValue={push}
                    removeValue={(valueToRemove) => remove(subjects.indexOf(valueToRemove))}
                    clear={() =>
                      setFieldValue(
                        name,
                        subjects.filter((keyword) => !selectedIds.includes(keyword))
                      )
                    }
                  />
                  {!defaultVocabularyNames.includes(vocabulary) && (
                    <>
                      <StyledRemoveButton
                        color="error"
                        startIcon={<RemoveCircleIcon />}
                        onClick={() => setVocabularyToRemove(vocabulary)}>
                        {t('description.remove_vocabulary')}
                      </StyledRemoveButton>

                      <ConfirmDialog
                        open={vocabularyToRemove === vocabulary}
                        title={t('description.confirm_remove_vocabulary_title')}
                        onAccept={() => {
                          const updatedValues = subjects.filter((keyword) => !keyword.startsWith(baseId));
                          setFieldValue(name, updatedValues);
                          setVisibleVocabularies(
                            visibleVocabularies.filter((visibleVocabulary) => visibleVocabulary !== vocabulary)
                          );
                          setVocabularyToRemove('');
                        }}
                        onCancel={() => setVocabularyToRemove('')}>
                        <Typography>
                          {t('description.confirm_remove_vocabulary_text', {
                            vocabulary: t(i18nKey),
                          })}
                        </Typography>
                      </ConfirmDialog>
                    </>
                  )}
                </StyledVocabularyRow>
              );
            })}
          </>
        )}
      </FieldArray>

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
