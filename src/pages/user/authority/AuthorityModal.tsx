import React, { FC } from 'react';
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

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
  margin-top: 2rem;
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
  const { t } = useTranslation('common');
  const { authority } = useSelector((store: RootStore) => store.user);
  const noOrcid = !authority || !authority.orcids || authority.orcids.length === 0;

  return (
    <Modal
      dataTestId="connect-author-modal"
      ariaLabelledBy="connect-author-modal"
      disableEscape={!authority}
      openModal={true}
      onClose={closeModal}
      headingText={t('profile:authority.connect_authority')}
      maxWidth="md">
      <>
        {authority ? (
          <>
            <AuthorityCard authority={authority} isConnected />
            <StyledNormalText>{t('profile:authority.connected_authority')}</StyledNormalText>
          </>
        ) : (
          <ConnectAuthority />
        )}
        {noOrcid && (
          <StyledButtonContainer>
            <Button
              color="primary"
              variant="contained"
              data-testid="modal_next"
              onClick={handleNextClick}
              disabled={!authority}>
              {t('next')}
            </Button>
          </StyledButtonContainer>
        )}
      </>
    </Modal>
  );
};

export default AuthorityModal;
