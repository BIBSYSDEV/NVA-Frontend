import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from './InstitutionSelector';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setInstitution } from '../../redux/actions/institutionActions';
import { User } from '../../types/user.types';
import { updateInstitutionForAuthority } from './../../api/authorityApi';
import { InstitutionPresentation } from './../../types/institution.types';
import { institutionLookup } from '../../api/institutionApi';
import { setAuthorityData } from './../../redux/actions/userActions';
import { addNotification } from '../../redux/actions/notificationActions';

const StyledInstitutionDialog = styled.div`
  width: 20rem;
`;

interface InstitutionDialogProps {
  user: User;
  addInstitutionPresentation: (institutionPresentation: InstitutionPresentation) => void;
}

const InstitutionDialog: React.FC<InstitutionDialogProps> = ({ user, addInstitutionPresentation }) => {
  const [open, setOpen] = useState(false);
  const [selectedCristinUnitId, setSelectedCristinUnitId] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!user.authority.orgunitids?.find(orgunitid => orgunitid === selectedCristinUnitId)) {
      dispatch(setInstitution(selectedCristinUnitId));
      const updatedAuthority = await updateInstitutionForAuthority(
        user.authority.systemControlNumber,
        selectedCristinUnitId
      );
      if (updatedAuthority?.error) {
        dispatch(addNotification(updatedAuthority.error));
      } else {
        dispatch(setAuthorityData(updatedAuthority));
        institutionLookup(selectedCristinUnitId).then(presentation => addInstitutionPresentation(presentation));
      }
    }
    setOpen(false);
  };

  return (
    <StyledInstitutionDialog>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {t('organization.add')}
      </Button>
      <Dialog open={open} onClose={handleConfirm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{t('organization.edit_institution')}</DialogTitle>
        <DialogContent>
          <InstitutionSelector valueFunction={setSelectedCristinUnitId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained" color="primary">
            {t('organization.close')}
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" disabled={!selectedCristinUnitId}>
            {t('organization.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledInstitutionDialog>
  );
};

export default InstitutionDialog;
