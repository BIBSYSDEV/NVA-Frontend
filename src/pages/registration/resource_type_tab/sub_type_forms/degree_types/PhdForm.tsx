import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Box, Button, List, TextField, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { DegreeRegistration } from '../../../../../types/publication_types/degreeRegistration.types';
import { UnconfirmedDocument } from '../../../../../types/publication_types/researchDataRegistration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { findRelatedDocumentIndex } from '../../../../../utils/registration-helpers';
import { filterConfirmedDocuments } from '../../../../public_registration/PublicRegistrationContent';
import { PublisherField } from '../../components/PublisherField';
import { SearchRelatedResultField } from '../../components/SearchRelatedResultField';
import { SeriesFields } from '../../components/SeriesFields';
import { IsbnAndPages } from '../../components/isbn_and_pages/IsbnAndPages';
import { RelatedResourceRow } from '../research_data_types/RelatedResourceRow';

export const PhdForm = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<DegreeRegistration>();
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);
  const related = values.entityDescription.reference?.publicationInstance.related;

  const confirmedDocuments = filterConfirmedDocuments(related);

  const unconfirmedRelatedTexts = (related?.filter((r) => r.type === 'UnconfirmedDocument') ??
    []) as UnconfirmedDocument[];

  return (
    <>
      <PublisherField />

      <IsbnAndPages />
      <SeriesFields />

      <Typography variant="h2">{t('registration.resource_type.related_result')}</Typography>

      <SearchRelatedResultField />

      {(confirmedDocuments.length > 0 || unconfirmedRelatedTexts.length > 0) && (
        <List disablePadding>
          {confirmedDocuments.map((uri) => (
            <RelatedResourceRow
              key={uri}
              uri={uri}
              removeRelatedResource={() => {
                const indexToRemove = findRelatedDocumentIndex(related, uri);
                if (indexToRemove > -1) {
                  const newRelated = related?.filter((_, index) => index !== indexToRemove);
                  setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelated);
                }
              }}
            />
          ))}

          {related?.map((relation, index) => {
            if (relation.type === 'ConfirmedDocument') {
              return null;
            }

            return (
              <Box key={index} component="li" sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mb: '0.5rem' }}>
                <Field name={`${ResourceFieldNames.PublicationInstanceRelated}[${index}].text`}>
                  {({ field }: FieldProps<string>) => <TextField {...field} variant="filled" multiline fullWidth />}
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

          <ConfirmDialog
            open={indexToRemove !== null && indexToRemove > -1}
            title={t('registration.resource_type.research_data.remove_relation')}
            onAccept={() => {
              const newRelated = related?.filter((_, index) => index !== indexToRemove);
              setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelated);
              setIndexToRemove(null);
            }}
            onCancel={() => setIndexToRemove(null)}>
            <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
          </ConfirmDialog>
        </List>
      )}
    </>
  );
};
