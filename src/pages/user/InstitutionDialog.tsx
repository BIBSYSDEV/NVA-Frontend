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
import { User } from '../../types/user.types';
import { updateInstitutionForAuthority } from './../../api/authorityApi';
import { institutionLookup } from '../../api/institutionApi';
import { setAuthorityData } from './../../redux/actions/userActions';
import { addNotification } from '../../redux/actions/notificationActions';
import { addInstitutionPresentation } from '../../redux/actions/institutionActions';

const StyledInstitutionDialog = styled.div`
  width: 20rem;
`;

interface InstitutionDialogProps {
  user: User;
  title: string;
  dataTestId: string;
}

const InstitutionDialog: React.FC<InstitutionDialogProps> = ({ user, title, dataTestId }) => {
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
      const updatedAuthority = await updateInstitutionForAuthority(
        selectedCristinUnitId,
        user.authority.systemControlNumber
      );
      if (updatedAuthority?.error) {
        dispatch(addNotification(updatedAuthority.error, 'error'));
      } else if (updatedAuthority) {
        dispatch(setAuthorityData(updatedAuthority));
        try {
          const presentation = await institutionLookup(selectedCristinUnitId);
          dispatch(addInstitutionPresentation(presentation));
        } catch {}
      }
    }
    setOpen(false);
  };

  return (
    <StyledInstitutionDialog>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        disabled={!user.authority?.systemControlNumber}
        data-testid={dataTestId}>
        {t('common:add')}
      </Button>
      <Dialog open={open} onClose={handleConfirm} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <InstitutionSelector setSelectedCristinUnitId={setSelectedCristinUnitId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained" color="primary" data-testid="institution-cancel-button">
            {t('common:cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={!selectedCristinUnitId}
            data-testid="institution-add-button">
            {t('common:save')}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledInstitutionDialog>
  );
};

export default InstitutionDialog;
