import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';

export const DoiField = () => {
  const { t } = useTranslation('registration');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setFieldValue, values } = useFormikContext<Registration>();

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const removeDoi = () => {
    setFieldValue(ResourceFieldNames.Doi, '');
    toggleConfirmDialog();
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
        label={t('registration.link_to_resource')}
        disabled
        value={doi ?? referenceDoi}
        multiline
      />

      {referenceDoi && (
        <Button color="error" variant="outlined" endIcon={<DeleteIcon />} onClick={toggleConfirmDialog}>
          {t('resource_type.remove_doi')}
        </Button>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        title={t('resource_type.remove_doi')}
        onAccept={removeDoi}
        onCancel={toggleConfirmDialog}
        dataTestId="confirm-delete-doi-dialog">
        <Typography>{t('resource_type.remove_doi_text')}</Typography>
      </ConfirmDialog>
    </Box>
  ) : null;
};
