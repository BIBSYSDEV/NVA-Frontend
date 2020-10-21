import React, { FC, useState } from 'react';
import { FormikProps, useFormikContext, getIn } from 'formik';
import { TextField, InputAdornment, Typography } from '@material-ui/core';
import styled from 'styled-components';
import ClearIcon from '@material-ui/icons/Clear';
import { useTranslation } from 'react-i18next';
import { Publication } from '../../../../types/publication.types';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import ConfirmDialog from '../../../../components/ConfirmDialog';

const StyledClearIcon = styled(ClearIcon)`
  color: ${({ theme }) => theme.palette.danger.main};
  cursor: pointer;
`;

const DoiField: FC = () => {
  const { t } = useTranslation('publication');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { setFieldValue, values }: FormikProps<Publication> = useFormikContext();

  const toggleConfirmDialog = () => {
    setOpenConfirmDialog(!openConfirmDialog);
  };

  const changeType = () => {
    setFieldValue(ReferenceFieldNames.DOI, '');
    toggleConfirmDialog();
  };

  const doiUrl = getIn(values, ReferenceFieldNames.DOI);

  return doiUrl ? (
    <>
      <TextField
        variant="outlined"
        fullWidth
        label={t('registration.link_to_resource')}
        disabled
        InputProps={{
          endAdornment: (
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
