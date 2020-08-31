import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, DialogActions } from '@material-ui/core';
import styled from 'styled-components';

import { Authority } from '../../../types/authority.types';
import { RootStore } from '../../../redux/reducers/rootReducer';
import AuthorityCard from './AuthorityCard';
import { ConnectAuthority } from './ConnectAuthority';
import Modal from '../../../components/Modal';
import NormalText from '../../../components/NormalText';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuthentication } from '../../../utils/hooks/useAuthentication';

const StyledNormalText = styled(NormalText)`
  margin-top: 1rem;
`;

interface AuthorityModalProps {
  authority: Authority | null;
  handleNextClick: () => void;
  closeModal: () => void;
}

const AuthorityModal: FC<AuthorityModalProps> = ({ closeModal, handleNextClick }) => {
  const { t } = useTranslation('profile');
  const { authority } = useSelector((store: RootStore) => store.user);
  const [openCancelConfirmation, setOpenCancelConfirmation] = useState(false);
  const { handleLogout } = useAuthentication();

  const handleCloseModal = () => {
    // Allow user to close modal without warning only if user already has an authority
    if (authority) {
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
        maxWidth="md">
        <>
          {authority ? (
            <>
              <AuthorityCard authority={authority} isConnected />
              <StyledNormalText>{t('authority.connected_authority')}</StyledNormalText>
              <DialogActions>
                <Button
                  color="primary"
                  variant="contained"
                  data-testid="modal_next"
                  onClick={handleNextClick}
                  disabled={!authority}>
                  {t('common:next')}
                </Button>
              </DialogActions>
            </>
          ) : (
            <ConnectAuthority handleCloseModal={handleCloseModal} />
          )}
        </>
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
