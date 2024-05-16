import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';

interface DoiFieldProps {
  canEditDoi: boolean;
}

export const DoiField = ({ canEditDoi }: DoiFieldProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setFieldValue, values } = useFormikContext<Registration>();

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const doi = values.doi;
  const referenceDoi = values.entityDescription?.reference?.doi ?? '';

  return doi || referenceDoi ? (
    <Box
      sx={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <TextField
        InputProps={{ startAdornment: <LinkIcon sx={{ mr: '0.5rem' }} /> }}
        data-testid="doi-field"
        variant="filled"
        fullWidth
        sx={{ flex: '1 25rem' }}
        label={t('registration.registration.link_to_resource')}
        disabled
        value={doi || referenceDoi}
        multiline
      />

      {referenceDoi && (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outlined"
            endIcon={<OpenInNewIcon />}
            href={referenceDoi}
            target="_blank"
            rel="noopener noreferrer">
            {t('common.open')}
          </Button>
          <Button
            color="error"
            variant="outlined"
            endIcon={<CancelIcon />}
            onClick={toggleConfirmDialog}
            disabled={!canEditDoi}>
            {t('registration.resource_type.remove_doi')}
          </Button>
          <ConfirmDialog
            open={openConfirmDialog}
            title={t('registration.resource_type.remove_doi')}
            onAccept={() => {
              setFieldValue(ResourceFieldNames.Doi, '');
              toggleConfirmDialog();
            }}
            onCancel={toggleConfirmDialog}
            dialogDataTestId="confirm-delete-doi-dialog">
            <Typography>{t('registration.resource_type.remove_doi_text')}</Typography>
          </ConfirmDialog>
        </Box>
      )}
    </Box>
  ) : null;
};
