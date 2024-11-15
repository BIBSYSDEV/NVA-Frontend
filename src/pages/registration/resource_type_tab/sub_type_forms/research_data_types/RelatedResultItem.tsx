import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton, ListItem, Skeleton, TextField, Tooltip, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { RegistrationListItemContent } from '../../../../../components/RegistrationList';
import { SearchListContainer } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { Registration, RelatedDocument } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { convertToRegistrationSearchItem } from '../../../../../utils/registration-helpers';

interface RelatedResultItemProps {
  document: RelatedDocument;
  index: number;
  relatedLength: number;
  onMoveRelatedResult: (newSequence: number, oldSequence: number) => void;
  onRemoveDocument: (index: number) => void;
}

export const RelatedResultItem = ({
  document,
  index,
  relatedLength,
  onMoveRelatedResult,
  onRemoveDocument,
}: RelatedResultItemProps) => {
  const { t } = useTranslation();
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);
  const uri = document.type === 'ConfirmedDocument' ? document.identifier : '';
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: isInternalRegistration ? uri : '' });
  const isConfirmedDocument = document.type === 'ConfirmedDocument';

  return (
    <ListItem disablePadding sx={{ mb: '0.5rem' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          minWidth: '4rem',
          mr: '0.5rem',
        }}>
        {relatedLength > 1 && (
          <>
            {document.sequence !== relatedLength && (
              <Tooltip title={t('common.move_down')}>
                <IconButton
                  size="small"
                  sx={{ minWidth: 'auto', height: 'fit-content', gridColumn: 1 }}
                  onClick={() =>
                    !!document.sequence && document.sequence > 0
                      ? onMoveRelatedResult(document.sequence + 1, document.sequence)
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
                  sx={{ minWidth: 'auto', height: 'fit-content', gridColumn: 2 }}
                  onClick={() =>
                    !!document.sequence && document.sequence > 0
                      ? onMoveRelatedResult(document.sequence - 1, document.sequence)
                      : null
                  }>
                  <ArrowUpwardIcon color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>
      {isConfirmedDocument && registration ? (
        <>
          {isLoadingRegistration ? (
            <Skeleton width="30%" />
          ) : (
            <SearchListContainer sx={{ borderLeftColor: 'registration.main', width: '100%' }}>
              <RegistrationListItemContent
                registration={convertToRegistrationSearchItem(registration)}
                onRemoveRelated={() => setIndexToRemove(index)}
              />
            </SearchListContainer>
          )}
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            bgcolor: 'white',
            borderRadius: '0.25rem',
            border: '1px solid lightgray',
            p: '0.5rem',
            width: '100%',
          }}>
          <Field name={`${ResourceFieldNames.PublicationInstanceRelated}[${index}].text`}>
            {({ field, meta: { touched, error } }: FieldProps<string>) => (
              <TextField
                {...field}
                label={t('common.reference')}
                placeholder={t('feedback.validation.reference_required')}
                variant="filled"
                multiline
                fullWidth
                required
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <IconButton
            sx={{ mr: '0.5rem' }}
            title={t('registration.resource_type.research_data.remove_relation')}
            data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(index.toString())}
            onClick={() => setIndexToRemove(index)}>
            <CancelIcon color="primary" />
          </IconButton>
        </Box>
      )}

      <ConfirmDialog
        open={indexToRemove !== null}
        title={t('registration.resource_type.research_data.remove_relation')}
        onAccept={() => {
          if (indexToRemove !== null) {
            onRemoveDocument(indexToRemove);
            setIndexToRemove(null);
          }
        }}
        onCancel={() => setIndexToRemove(null)}>
        <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
      </ConfirmDialog>
    </ListItem>
  );
};
