import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { InputAdornment, TextField, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';

const StyledClearIcon = styled(ClearIcon)`
  color: ${({ theme }) => theme.palette.error.main};
  cursor: pointer;
`;

const DoiField = () => {
  const { t } = useTranslation('registration');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setFieldValue, values } = useFormikContext<Registration>();

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const changeType = () => {
    setFieldValue(ReferenceFieldNames.DOI, '');
    toggleConfirmDialog();
  };

  const doiUrl = values.doi ?? values.entityDescription.reference.doi;

  return doiUrl ? (
    <>
      <TextField
        data-testid="doi-field"
        variant="filled"
        fullWidth
        label={t('registration.link_to_resource')}
        disabled
        InputProps={{
          endAdornment: !values.doi && (
            <InputAdornment position="end">
              <StyledClearIcon onClick={toggleConfirmDialog} />
            </InputAdornment>
          ),
        }}
        value={doiUrl}
      />

      <ConfirmDialog
        open={openConfirmDialog}
        title={t('references.delete_doi_title')}
        onAccept={changeType}
        onCancel={toggleConfirmDialog}>
        <Typography>{t('references.delete_doi_text')}</Typography>
      </ConfirmDialog>
    </>
  ) : null;
};

export default DoiField;
