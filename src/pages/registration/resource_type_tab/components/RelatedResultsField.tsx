import { Box, Button, List, TextField, Typography } from '@mui/material';
import { SearchRelatedResultField } from './SearchRelatedResultField';
import { RelatedResourceRow } from '../sub_type_forms/research_data_types/RelatedResourceRow';
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, move, useFormikContext } from 'formik';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../utils/dataTestIds';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  ConfirmedDocument,
  createEmptyUnconfirmedDocument,
  UnconfirmedDocument,
} from '../../../../types/registration.types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { DegreeRegistration } from '../../../../types/publication_types/degreeRegistration.types';
import { useState } from 'react';

export const RelatedResultsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<DegreeRegistration>();
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);
  const related = values.entityDescription.reference?.publicationInstance.related ?? [];

  const removeRelatedItem = (indexToRemove: number) => {
    const newRelated = related?.filter((_, thisIndex) => thisIndex !== indexToRemove);
    setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelated);
  };

  const handleMoveRelatedResult = (newSequence?: number, oldSequence?: number) => {
    if (!newSequence || !oldSequence) return;

    const oldIndex = related.findIndex((r) => r.sequence === oldSequence);
    const minNewIndex = 0;
    const maxNewIndex = related ? related.length - 1 : 0;

    const newIndex =
      newSequence - 1 > maxNewIndex
        ? maxNewIndex
        : newSequence < minNewIndex
          ? minNewIndex
          : related
            ? related.findIndex((r) => r.sequence === newSequence)
            : 0;

    const orderedRelatedResults =
      newIndex >= 0 && related
        ? (move(related, oldIndex, newIndex) as (ConfirmedDocument | UnconfirmedDocument)[])
        : related;

    // Ensure incrementing sequence values
    const newRelatedResults = orderedRelatedResults
      ? orderedRelatedResults.map((related, index) => ({
          ...related,
          sequence: index + 1,
        }))
      : [];

    setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelatedResults);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        bgcolor: 'secondary.light',
        borderRadius: '0.25rem',
        p: '1rem',
      }}>
      <Typography variant="h2">{t('registration.resource_type.related_results')}</Typography>

      <SearchRelatedResultField />

      {related && related.length > 0 && (
        <List disablePadding>
          {related?.map((document, index) => {
            if (document.type === 'ConfirmedDocument') {
              return (
                <RelatedResourceRow
                  key={document.identifier}
                  uri={document.identifier}
                  removeRelatedResource={() => removeRelatedItem(index)}
                />
              );
            } else if (document.type === 'UnconfirmedDocument') {
              return (
                <Box
                  key={index}
                  component="li"
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: '0.25rem 1rem',
                    mb: '0.5rem',
                  }}>
                  <Button
                    onClick={() =>
                      document.sequence !== undefined && document.sequence > 0
                        ? handleMoveRelatedResult(document.sequence - 1, document.sequence)
                        : null
                    }>
                    Up
                  </Button>
                  <Button
                    onClick={() =>
                      document.sequence !== undefined && document.sequence < related.length
                        ? handleMoveRelatedResult(document.sequence + 1, document.sequence)
                        : null
                    }>
                    Down
                  </Button>

                  <Field name={`${ResourceFieldNames.PublicationInstanceRelated}[${index}].text`}>
                    {({ field, meta: { touched, error } }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        label={t('registration.resource_type.related_result')}
                        variant="filled"
                        multiline
                        fullWidth
                        required
                        error={touched && !!error}
                        helperText={<ErrorMessage name={field.name} />}
                      />
                    )}
                  </Field>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(index.toString())}
                    onClick={() => setIndexToRemove(index)}
                    startIcon={<RemoveCircleOutlineIcon />}>
                    {t('registration.resource_type.research_data.remove_relation')}
                  </Button>
                </Box>
              );
            } else {
              return null;
            }
          })}
        </List>
      )}

      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push }: FieldArrayRenderProps) => (
          <Button
            data-testid={dataTestId.registrationWizard.resourceType.addRelatedButton}
            onClick={() => push(createEmptyUnconfirmedDocument(related.length))}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ alignSelf: 'start' }}>
            {t('common.add_custom', { name: t('registration.resource_type.related_result').toLocaleLowerCase() })}
          </Button>
        )}
      </FieldArray>

      <ConfirmDialog
        open={indexToRemove !== null}
        title={t('registration.resource_type.research_data.remove_relation')}
        onAccept={() => {
          if (indexToRemove !== null) {
            removeRelatedItem(indexToRemove);
            setIndexToRemove(null);
          }
        }}
        onCancel={() => setIndexToRemove(null)}>
        <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
      </ConfirmDialog>
    </Box>
  );
};
