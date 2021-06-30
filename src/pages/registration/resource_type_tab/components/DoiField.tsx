import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MuiThemeProvider, TextField, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { DangerButton } from '../../../../components/DangerButton';
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
    setFieldValue(ResourceFieldNames.DOI, '');
    toggleConfirmDialog();
  };

  const doi = values.doi;
  const referenceDoi = values.entityDescription.reference.doi;

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
      />

      {referenceDoi && (
        <DangerButton variant="contained" endIcon={<DeleteIcon />} onClick={toggleConfirmDialog}>
          {t('resource_type.remove_doi')}
        </DangerButton>
      )}
      <MuiThemeProvider theme={lightTheme}>
        <ConfirmDialog
          open={openConfirmDialog}
          title={t('resource_type.remove_doi')}
          onAccept={removeDoi}
          onCancel={toggleConfirmDialog}
          dataTestId="confirm-delete-doi-dialog">
          <StyledTypography>{t('resource_type.remove_doi_text')}</StyledTypography>
        </ConfirmDialog>
      </MuiThemeProvider>
    </StyledDoiRow>
  ) : null;
};
