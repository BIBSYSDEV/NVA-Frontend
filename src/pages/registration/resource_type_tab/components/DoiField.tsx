import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, Button, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
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
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
      <TextField
        id="doi-field"
        data-testid="doi-field"
        variant="filled"
        fullWidth
        label={t('registration.registration.link_to_resource')}
        disabled
        value={doi || referenceDoi}
        multiline
      />

      {referenceDoi && (
        <>
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
        </>
      )}
    </Box>
  ) : null;
};
