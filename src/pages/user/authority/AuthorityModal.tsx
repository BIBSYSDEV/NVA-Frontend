import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DialogActions } from '@material-ui/core';
import styled from 'styled-components';

import AuthorityCard from './AuthorityCard';
import { ConnectAuthority } from './ConnectAuthority';
import Modal from '../../../components/Modal';
import NormalText from '../../../components/NormalText';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuthentication } from '../../../utils/hooks/useAuthentication';
import { User } from '../../../types/user.types';

const StyledNormalText = styled(NormalText)`
  margin-top: 1rem;
`;

interface AuthorityModalProps {
  user: User;
  handleNextClick: () => void;
  closeModal: () => void;
}

const AuthorityModal: FC<AuthorityModalProps> = ({ closeModal, handleNextClick, user }) => {
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
        headingText={t('authority.connect_authority')}
        fullWidth
        maxWidth="md">
        {user.authority ? (
          <>
            <AuthorityCard authority={user.authority} isConnected />
            <StyledNormalText>{t('authority.connected_authority')}</StyledNormalText>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
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
        onCancel={() => setOpenCancelConfirmation(false)}>
        {t('authority.cancel_connect_authority_text')}
      </ConfirmDialog>
    </>
  );
};

export default AuthorityModal;
