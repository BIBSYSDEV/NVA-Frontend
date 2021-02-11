import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DialogActions } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { ConnectAuthority } from './ConnectAuthority';
import Modal from '../../../components/Modal';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuthentication } from '../../../utils/hooks/useAuthentication';
import { User } from '../../../types/user.types';
import AuthorityList from './AuthorityList';

interface AuthorityModalProps {
  user: User;
  handleNextClick: () => void;
  closeModal: () => void;
}

const AuthorityModal = ({ closeModal, handleNextClick, user }: AuthorityModalProps) => {
  const { t } = useTranslation('profile');
  const [openCancelConfirmation, setOpenCancelConfirmation] = useState(false);
  const { handleLogout } = useAuthentication();

  const handleCloseModal = () => {
    // Allow user to close modal without warning only if user already has an authority
    if (user.authority) {
      closeModal();
    } else {
      setOpenCancelConfirmation(true);
    }
  };

  return (
    <>
      <Modal
        dataTestId="connect-author-modal"
        aria-labelledby="connect-author-modal"
        open={true}
        onClose={handleCloseModal}
        headingText={user.authority ? t('authority.connected_authority') : t('authority.connect_authority')}
        fullWidth
        maxWidth="md">
        {user.authority ? (
          <>
            <AuthorityList authorities={[user.authority]} selectedArpId={user.authority.id} />
            <DialogActions>
              <Button
                color="secondary"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                data-testid="modal_next"
                onClick={handleNextClick}
                disabled={!user.authority}>
                {t('common:next')}
              </Button>
            </DialogActions>
          </>
        ) : (
          <ConnectAuthority user={user} handleCloseModal={handleCloseModal} />
        )}
      </Modal>

      <ConfirmDialog
        open={openCancelConfirmation}
        title={t('authority.cancel_connect_authority_title')}
        onAccept={handleLogout}
        onCancel={() => setOpenCancelConfirmation(false)}
        dataTestId="confirm-cancel-connect-authority-dialog">
        {t('authority.cancel_connect_authority_text')}
      </ConfirmDialog>
    </>
  );
};

export default AuthorityModal;
