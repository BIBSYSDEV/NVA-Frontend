import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ThemeProvider, TextField, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { lightTheme } from '../../../../themes/lightTheme';

const StyledDoiRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
`;

const StyledTypography = styled(Typography)`
  white-space: pre-wrap;
`;

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
  const referenceDoi = values.entityDescription?.reference.doi ?? '';

  return doi || referenceDoi ? (
    <StyledDoiRow>
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
        <Button color="error" variant="contained" endIcon={<DeleteIcon />} onClick={toggleConfirmDialog}>
          {t('resource_type.remove_doi')}
        </Button>
      )}
      <ThemeProvider theme={lightTheme}>
        <ConfirmDialog
          open={openConfirmDialog}
          title={t('resource_type.remove_doi')}
          onAccept={removeDoi}
          onCancel={toggleConfirmDialog}
          dataTestId="confirm-delete-doi-dialog">
          <StyledTypography>{t('resource_type.remove_doi_text')}</StyledTypography>
        </ConfirmDialog>
      </ThemeProvider>
    </StyledDoiRow>
  ) : null;
};
