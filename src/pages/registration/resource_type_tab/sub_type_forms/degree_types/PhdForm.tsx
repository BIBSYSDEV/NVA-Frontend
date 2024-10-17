import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, List, TextField, Typography } from '@mui/material';
import { Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../../../types/publication_types/degreeRegistration.types';
import { emptyUnconfirmedDocument } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { PublisherField } from '../../components/PublisherField';
import { SearchRelatedResultField } from '../../components/SearchRelatedResultField';
import { SeriesFields } from '../../components/SeriesFields';
import { IsbnAndPages } from '../../components/isbn_and_pages/IsbnAndPages';
import { RelatedResourceRow } from '../research_data_types/RelatedResourceRow';
import i18n from '../../../../../translations/i18n';

export const PhdForm = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<DegreeRegistration>();
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);
  const related = values.entityDescription.reference?.publicationInstance.related;

  const removeRelatedItem = (indexToRemove: number) => {
    const newRelated = related?.filter((_, thisIndex) => thisIndex !== indexToRemove);
    setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelated);
  };

  return (
    <>
      <PublisherField />

      <IsbnAndPages />
      <SeriesFields />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography variant="h2">{t('registration.resource_type.related_results')}</Typography>

        <SearchRelatedResultField />

        {related && related.length > 0 && (
          <List disablePadding>
            {related.map((document, index) => {
              if (document.type === 'UnconfirmedDocument') {
                return null;
              }
              return (
                <RelatedResourceRow
                  key={document.identifier}
                  uri={document.identifier}
                  removeRelatedResource={() => removeRelatedItem(index)}
                />
              );
            })}

            {related?.map((relation, index) => {
              if (relation.type === 'ConfirmedDocument') {
                return null;
              }
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
                  <Field
                    name={`${ResourceFieldNames.PublicationInstanceRelated}[${index}].text`}
                    validate={(value: string) =>
                      !value ? t('feedback.validation.is_required', { field: t('common.result') }) : undefined
                    }>
                    {({ field, meta }: FieldProps<string>) => (
                      <TextField
                        {...field}
                        label={t('registration.resource_type.related_result')}
                        variant="filled"
                        multiline
                        fullWidth
                        required
                        error={!!meta.error}
                        helperText={meta.error ? meta.error : ''}
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
            })}
          </List>
        )}

        <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
          {({ push }: FieldArrayRenderProps) => (
            <Button
              data-testid={dataTestId.registrationWizard.resourceType.addRelatedButton}
              onClick={() => push(emptyUnconfirmedDocument)}
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
    </>
  );
};
