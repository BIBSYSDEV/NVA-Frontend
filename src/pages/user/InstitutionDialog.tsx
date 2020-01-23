import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './InstitutionSelector';
import styled from 'styled-components';

const StyledInstitutionDialog = styled.div`
  width: 20rem;
`;

const StyledDialog = styled(Dialog)``;

const InstitutionDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCristinUnitId, setSelectedCristinUnitId] = useState('');
  const { t } = useTranslation('profile');

  const setValue = (cristinUnitId: string) => {
    console.log(`setvalue = ${cristinUnitId}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setValue(selectedCristinUnitId);
    setOpen(false);
  };

  return (
    <StyledInstitutionDialog>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {t('organization.add')}
      </Button>
      <StyledDialog open={open} onClose={handleConfirm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('organization.edit_institution')}</DialogTitle>
        <DialogContent>
          <InstitutionSelector valueFunction={setSelectedCristinUnitId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained" color="primary">
            {t('organization.close')}
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            {t('organization.save')}
          </Button>
        </DialogActions>
      </StyledDialog>
    </StyledInstitutionDialog>
  );
};

export default InstitutionDialog;
