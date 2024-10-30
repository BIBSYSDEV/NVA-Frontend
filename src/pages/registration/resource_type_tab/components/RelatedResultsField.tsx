import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, List, ListItem, Tooltip, Typography } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, move, useFormikContext } from 'formik';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { DegreeRegistration } from '../../../../types/publication_types/degreeRegistration.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import {
  ConfirmedDocument,
  createEmptyUnconfirmedDocument,
  UnconfirmedDocument,
} from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { RelatedResultItem } from '../sub_type_forms/research_data_types/RelatedResultItem';
import { SearchRelatedResultField } from './SearchRelatedResultField';

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

    const oldIndex = related.findIndex((related) => related.sequence === oldSequence);
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

      <Trans
        i18nKey={'registration.resource_type.related_results_description'}
        components={[
          <Typography key={0}>
            <span style={{ fontWeight: 'bold' }} />
          </Typography>,
        ]}
      />

      <FieldArray name={ResourceFieldNames.PublicationInstanceRelated}>
        {({ push }: FieldArrayRenderProps) => (
          <Button
            variant="outlined"
            data-testid={dataTestId.registrationWizard.resourceType.addRelatedButton}
            onClick={() => push(createEmptyUnconfirmedDocument(related.length))}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ alignSelf: 'start' }}>
            {t('common.add_custom', { name: t('registration.resource_type.related_result').toLocaleLowerCase() })}
          </Button>
        )}
      </FieldArray>

      {related && related.length > 0 && (
        <List disablePadding>
          {related
            ?.sort((a, b) => (a.sequence && b.sequence ? a.sequence - b.sequence : 0))
            .map((document, index) => {
              return (
                <ListItem
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: '1rem',
                    bgcolor: 'white',
                    borderRadius: '0.25rem',
                    border: '1px solid lightgray',
                    my: '0.25rem',
                    minHeight: '5rem',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      minWidth: '4rem',
                    }}>
                    {related.length !== document.sequence && (
                      <Tooltip title={t('common.move_down')}>
                        <IconButton
                          size="small"
                          sx={{ minWidth: 'auto', height: 'fit-content', gridArea: 'down-arrow' }}
                          onClick={() =>
                            !!document.sequence && document.sequence > 0
                              ? handleMoveRelatedResult(document.sequence + 1, document.sequence)
                              : null
                          }>
                          <ArrowDownwardIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {document.sequence !== 1 && (
                      <Tooltip title={t('common.move_up')}>
                        <IconButton
                          size="small"
                          sx={{ minWidth: 'auto', height: 'fit-content', gridArea: 'up-arrow' }}
                          onClick={() =>
                            !!document.sequence && document.sequence > 0
                              ? handleMoveRelatedResult(document.sequence - 1, document.sequence)
                              : null
                          }>
                          <ArrowUpwardIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <RelatedResultItem index={index} document={document} />

                  <IconButton
                    title={t('registration.resource_type.research_data.remove_relation')}
                    data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(index.toString())}
                    onClick={() => setIndexToRemove(index)}>
                    <CloseIcon
                      fontSize="small"
                      sx={{
                        color: 'white',
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                      }}
                    />
                  </IconButton>
                </ListItem>
              );
            })}
        </List>
      )}

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
