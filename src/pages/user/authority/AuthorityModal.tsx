import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

import { Authority } from '../../../types/authority.types';
import { RootStore } from '../../../redux/reducers/rootReducer';
import AuthorityCard from './AuthorityCard';
import { ConnectAuthority } from './ConnectAuthority';
import Modal from '../../../components/Modal';
import { StyledRightAlignedButtonWrapper } from '../../../components/styled/Wrappers';
import NormalText from '../../../components/NormalText';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useAuthentication } from '../../../utils/hooks/useAuthentication';

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
  margin-top: 2rem;

  button:not(:first-child) {
    margin-left: 2rem;
  }
`;

const StyledNormalText = styled(NormalText)`
  margin-top: 1rem;
`;

interface AuthorityModalProps {
  authority: Authority | null;
  handleNextClick: () => void;
}

const AuthorityModal: FC<AuthorityModalProps> = ({ handleNextClick }) => {
  const { t } = useTranslation('profile');
  const { authority } = useSelector((store: RootStore) => store.user);
  const [openCancelConfirmation, setOpenCancelConfirmation] = useState(false);
  const { handleLogout } = useAuthentication();

  const toggleCancelConfirmation = () => setOpenCancelConfirmation((state) => !state);

  return (
    <>
      <Modal
        dataTestId="connect-author-modal"
        aria-labelledby="connect-author-modal"
        open={true}
        onClose={toggleCancelConfirmation}
        headingText={t('authority.connect_authority')}
        maxWidth="md">
        <>
          {authority ? (
            <>
              <AuthorityCard authority={authority} isConnected />
              <StyledNormalText>{t('authority.connected_authority')}</StyledNormalText>
            </>
          ) : (
            <ConnectAuthority />
          )}

          <StyledButtonContainer>
            {!authority && (
              <Button variant="text" onClick={toggleCancelConfirmation}>
                {t('common:cancel')}
              </Button>
            )}
            <Button
              color="primary"
              variant="contained"
              data-testid="modal_next"
              onClick={handleNextClick}
              disabled={!authority}>
              {t('common:next')}
            </Button>
          </StyledButtonContainer>
        </>
      </Modal>

      <ConfirmDialog
        open={openCancelConfirmation}
        title={t('authority.cancel_connect_authority_title')}
        onAccept={handleLogout}
        onCancel={toggleCancelConfirmation}>
        {t('authority.cancel_connect_authority_text')}
      </ConfirmDialog>
    </>
  );
};

export default AuthorityModal;
