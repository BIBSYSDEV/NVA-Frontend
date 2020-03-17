import React, { FC, useState } from 'react';
import { FormikProps, useFormikContext, getIn } from 'formik';
import {
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import styled from 'styled-components';
import ClearIcon from '@material-ui/icons/Clear';
import { useTranslation } from 'react-i18next';
import { Publication } from '../../../../types/publication.types';
import { ReferenceFieldNames } from '../../../../types/references.types';

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
        label={t('publication.link_to_publication')}
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

      <Dialog open={openConfirmDialog} onClose={toggleConfirmDialog}>
        <DialogTitle>{t('publication:references.delete_doi_title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('publication:references.delete_doi_text')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleConfirmDialog} variant="contained">
            {t('common:no')}
          </Button>
          <Button onClick={changeType} color="primary" variant="contained">
            {t('common:yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
};

export default DoiField;
