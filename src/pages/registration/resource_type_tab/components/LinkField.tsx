import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { dataTestId } from '../../../../utils/dataTestIds';

interface LinkFieldProps {
  fieldName: string;
  label: string;
  canEdit?: boolean;
  handleDelete?: () => void;
}

export const LinkField = ({ fieldName, label, canEdit = false, handleDelete }: LinkFieldProps) => {
  const { t } = useTranslation();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  return (
    <Field name={fieldName}>
      {({ field, meta: { error, touched } }: FieldProps<string>) => (
        <Box sx={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <TextField
            {...field}
            data-testid={dataTestId.registrationWizard.files.linkField}
            variant="filled"
            fullWidth
            label={label}
            disabled={!canEdit}
            multiline
            error={touched && !!error}
            helperText={<ErrorMessage name={fieldName} />}
            slotProps={{ input: { startAdornment: <LinkIcon sx={{ mr: '0.5rem' }} /> } }}
          />

          <IconButton
            color="primary"
            title={t('common.open')}
            href={field.value}
            target="_blank"
            rel="noopener noreferrer">
            <OpenInNewIcon />
          </IconButton>
          {handleDelete && (
            <>
              <IconButton
                color="primary"
                data-testid={dataTestId.registrationWizard.files.removeLinkButton}
                title={t('registration.resource_type.remove_link')}
                onClick={toggleConfirmDialog}>
                <CancelIcon />
              </IconButton>
              <ConfirmDialog
                open={openConfirmDialog}
                title={t('registration.resource_type.remove_link')}
                onAccept={() => {
                  handleDelete();
                  toggleConfirmDialog();
                }}
                onCancel={toggleConfirmDialog}>
                <Typography>{t('registration.resource_type.remove_link_text')}</Typography>
              </ConfirmDialog>
            </>
          )}
        </Box>
      )}
    </Field>
  );
};
