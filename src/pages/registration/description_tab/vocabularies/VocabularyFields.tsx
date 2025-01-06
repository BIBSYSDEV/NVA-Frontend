import AddIcon from '@mui/icons-material/Add';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { ParseKeys } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { hrcsActivityBaseId, hrcsCategoryBaseId } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { HrcsActivityInput } from './HrcsActivityInput';
import { HrcsCategoryInput } from './HrcsCategoryInput';
import { VocabularyComponentProps } from './VocabularyAutocomplete';

interface VocabularyConfig {
  [key: string]: {
    baseId: string;
    i18nKey: ParseKeys;
    component: (props: VocabularyComponentProps) => JSX.Element;
  };
}

// Specify which vocabularies to show, and their i18n key and component
const vocabularyConfig: VocabularyConfig = {
  hrcsActivity: {
    baseId: hrcsActivityBaseId,
    i18nKey: 'registration.description.hrcs_activities',
    component: HrcsActivityInput,
  },
  hrcsCategory: {
    baseId: hrcsCategoryBaseId,
    i18nKey: 'registration.description.hrcs_categories',
    component: HrcsCategoryInput,
  },
};
const vocabularyEntries = Object.entries(vocabularyConfig);

interface VocabularyFieldsProps {
  defaultVocabularies: string[];
  allowedVocabularies: string[];
}

export const VocabularyFields = ({ defaultVocabularies, allowedVocabularies }: VocabularyFieldsProps) => {
  const { t } = useTranslation();
  const {
    setFieldValue,
    values: { subjects },
  } = useFormikContext<Registration>();

  const vocabulariesWithValue = vocabularyEntries
    .filter(([, value]) => subjects.some((key) => key.startsWith(value.baseId)))
    .map(([key]) => key);
  const defaultVocabularyKeys = vocabularyEntries
    .filter(([, value]) => defaultVocabularies.includes(value.baseId))
    .map(([key]) => key);
  const allowedVocabularyKeys = vocabularyEntries
    .filter(([, value]) => allowedVocabularies.includes(value.baseId))
    .map(([key]) => key);

  const [visibleVocabularies, setVisibleVocabularies] = useState([
    ...new Set([...defaultVocabularyKeys, ...vocabulariesWithValue]),
  ]);
  const [vocabularyToRemove, setVocabularyToRemove] = useState('');
  const [newVocabularyAnchor, setNewVocabularyAnchor] = useState<null | HTMLElement>(null);

  const addableVocabularies = allowedVocabularyKeys.filter((vocabulary) => !visibleVocabularies.includes(vocabulary));

  return (
    <InputContainerBox>
      <FieldArray name={DescriptionFieldNames.Subjects}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            {visibleVocabularies.map((vocabulary) => {
              const { baseId, component, i18nKey } = vocabularyConfig[vocabulary];
              const VocabularyComponent = component;
              const selectedIds = subjects.filter((keyword) => keyword.startsWith(baseId));

              return (
                <Box
                  key={vocabulary}
                  data-testid={dataTestId.registrationWizard.description.vocabularyRow(vocabulary)}
                  sx={{ display: 'flex' }}>
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
                  {!defaultVocabularyKeys.includes(vocabulary) && (
                    <>
                      <Button
                        sx={{ ml: '2rem', minWidth: 'max-content' }}
                        color="error"
                        startIcon={<RemoveCircleIcon />}
                        onClick={() => setVocabularyToRemove(vocabulary)}>
                        {t('registration.description.remove_vocabulary')}
                      </Button>

                      <ConfirmDialog
                        open={vocabularyToRemove === vocabulary}
                        title={t('registration.description.confirm_remove_vocabulary_title')}
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
                          {t('registration.description.confirm_remove_vocabulary_text', {
                            vocabulary: t(i18nKey),
                          })}
                        </Typography>
                      </ConfirmDialog>
                    </>
                  )}
                </Box>
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
              {t(vocabularyConfig[vocabulary].i18nKey) as string}
            </MenuItem>
          ))}
        </Menu>
      )}

      {addableVocabularies.length > 0 && (
        <Button
          data-testid={dataTestId.registrationWizard.description.addVocabularyButton}
          onClick={(event) => setNewVocabularyAnchor(event.currentTarget)}
          startIcon={<AddIcon />}
          sx={{ alignSelf: 'flex-start' }}>
          {t('registration.description.add_vocabulary')}
        </Button>
      )}
    </InputContainerBox>
  );
};
