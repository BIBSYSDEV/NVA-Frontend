import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';

import { Authority } from '../../../types/authority.types';
import { RootStore } from '../../../redux/reducers/rootReducer';
import AuthorityCard from './AuthorityCard';
import { ConnectAuthority } from './ConnectAuthority';
import Modal from '../../../components/Modal';
import { StyledRightAlignedButtonWrapper } from '../../../components/styled/Wrappers';
import NormalText from '../../../components/NormalText';
import ConfirmDialog from '../../../components/ConfirmDialog';

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
  closeModal: () => void;
  handleNextClick: () => void;
}

const AuthorityModal: FC<AuthorityModalProps> = ({ closeModal, handleNextClick }) => {
  const { t } = useTranslation('profile');
  const { authority } = useSelector((store: RootStore) => store.user);
  const [cancelAuthoritySelection, setCancelAuthoritySelection] = useState(false);

  const noOrcid = !authority || !authority.orcids || authority.orcids.length === 0;

  const toggleCancelAuthoritySelection = () => {
    setCancelAuthoritySelection((state) => !state);
  };

  return (
    <>
      <Modal
        dataTestId="connect-author-modal"
        ariaLabelledBy="connect-author-modal"
        openModal={true}
        onClose={toggleCancelAuthoritySelection}
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
          {noOrcid && (
            <StyledButtonContainer>
              <Button variant="text" onClick={toggleCancelAuthoritySelection}>
                {t('common:cancel')}
              </Button>
              <Button
                color="primary"
                variant="contained"
                data-testid="modal_next"
                onClick={handleNextClick}
                disabled={!authority}>
                {t('common:next')}
              </Button>
            </StyledButtonContainer>
          )}
        </>
      </Modal>

      <ConfirmDialog
        open={cancelAuthoritySelection}
        title={t('authority.cancel_connect_authority_title')}
        onAccept={() => Auth.signOut()}
        onCancel={toggleCancelAuthoritySelection}>
        {t('authority.cancel_connect_authority_text')}
      </ConfirmDialog>
    </>
  );
};

export default AuthorityModal;
