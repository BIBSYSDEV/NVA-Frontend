import CancelIcon from '@mui/icons-material/Cancel';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';

interface LinkFieldProps {
  fieldName: string;
  label: string;
  canEdit?: boolean;
  handleDelete?: () => void;
  removeLinkTitle?: string;
  removeLinkDescription?: string;
}

export const LinkField = ({
  fieldName,
  label,
  canEdit = false,
  handleDelete,
  removeLinkTitle,
  removeLinkDescription,
}: LinkFieldProps) => {
  const { t } = useTranslation();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Field name={fieldName}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <>
            <TextField
              {...field}
              data-testid="doi-field"
              variant="filled"
              fullWidth
              sx={{ flex: '1 25rem' }}
              label={label}
              disabled={!canEdit}
              multiline
              error={touched && !!error}
              helperText={<ErrorMessage name={fieldName} />}
              slotProps={{ input: { startAdornment: <LinkIcon sx={{ mr: '0.5rem' }} /> } }}
            />

            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="outlined"
                endIcon={<OpenInNewIcon />}
                href={field.value}
                target="_blank"
                rel="noopener noreferrer">
                {t('common.open')}
              </Button>
              {handleDelete && (
                <>
                  <Button color="error" variant="outlined" endIcon={<CancelIcon />} onClick={toggleConfirmDialog}>
                    {t('registration.resource_type.remove_doi')}
                  </Button>
                  <ConfirmDialog
                    open={openConfirmDialog}
                    title={t('registration.resource_type.remove_doi')}
                    onAccept={() => {
                      handleDelete();
                      toggleConfirmDialog();
                    }}
                    onCancel={toggleConfirmDialog}
                    dialogDataTestId="confirm-delete-doi-dialog">
                    <Typography>{t('registration.resource_type.remove_doi_text')}</Typography>
                  </ConfirmDialog>
                </>
              )}
            </Box>
          </>
        )}
      </Field>
    </Box>
  );
};
