import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, List, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, move, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { DegreeRegistration } from '../../../../types/publication_types/degreeRegistration.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { ConfirmedDocument, emptyUnconfirmedDocument, UnconfirmedDocument } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { RelatedResultItem } from '../sub_type_forms/research_data_types/RelatedResultItem';
import { SearchRelatedResultField } from './SearchRelatedResultField';

export const RelatedResultsField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<DegreeRegistration>();

  const related = values.entityDescription.reference?.publicationInstance.related ?? [];

  const removeRelatedItem = (indexToRemove: number) => {
    const newRelated = related?.filter((_, thisIndex) => thisIndex !== indexToRemove);
    setFieldValue(ResourceFieldNames.PublicationInstanceRelated, newRelated);
  };

  const moveRelatedResult = (newSequence: number, oldSequence: number) => {
    const oldIndex = related.findIndex((document) => document.sequence === oldSequence);
    const minNewIndex = 0;
    const maxNewIndex = related ? related.length : 0;

    const newIndex =
      newSequence - 1 > maxNewIndex
        ? maxNewIndex
        : newSequence < minNewIndex
          ? minNewIndex
          : related
            ? related.findIndex((document) => document.sequence === newSequence)
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
      <Typography>{t('registration.resource_type.related_results_description')}</Typography>

      <SearchRelatedResultField />

      <Typography fontWeight="bold">{t('registration.resource_type.add_related_results_reference')}</Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push }: FieldArrayRenderProps) => (
          <Button
            variant="outlined"
            data-testid={dataTestId.registrationWizard.resourceType.addRelatedButton}
            onClick={() =>
              push({
                ...emptyUnconfirmedDocument,
                sequence: related.length + 1,
              })
            }
            startIcon={<AddCircleOutlineIcon />}
            sx={{ alignSelf: 'start' }}>
            {t('common.add_custom', { name: t('common.reference').toLocaleLowerCase() })}
          </Button>
        )}
      </FieldArray>

      {related && related.length > 0 && (
        <List disablePadding>
          {related
            .sort((a, b) => (a.sequence && b.sequence ? a.sequence - b.sequence : 0))
            .map((document, index) => (
              <RelatedResultItem
                key={index}
                document={document}
                index={index}
                relatedLength={related.length}
                onMoveRelatedResult={moveRelatedResult}
                onRemoveDocument={removeRelatedItem}
              />
            ))}
        </List>
      )}
    </Box>
  );
};
