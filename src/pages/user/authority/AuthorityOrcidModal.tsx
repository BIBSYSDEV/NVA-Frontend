import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import Modal from '../../../components/Modal';
import orcidLogo from '../../../resources/images/orcid_logo.svg';
import OrcidModalContent from '../OrcidModalContent';
import { ConnectAuthority } from './ConnectAuthority';
import AuthorityCard from './AuthorityCard';
import { Authority } from '../../../types/authority.types';
import { StyledRightAlignedButtonWrapper } from '../../../components/styled/Wrappers';

const StyledButtonContainer = styled(StyledRightAlignedButtonWrapper)`
  margin-top: 2rem;
`;

const StyledSkipButtonContainer = styled.div`
  text-align: center;
`;

const StyledButton = styled(Button)`
  max-width: 22rem;
`;

const StyledNormalText = styled.div`
  margin-top: 1rem;
`;

interface AuthorityOrcidModalProps {
  authority: Authority | null;
}

const AuthorityOrcidModal: FC<AuthorityOrcidModalProps> = ({ authority }) => {
  const { t } = useTranslation('common');
  const [openOrcidModal, setOpenOrcidModal] = useState(false);
  const [openAuthorityModal, setOpenAuthorityModal] = useState(true);

  const noOrcid = !authority || !authority.orcids || authority.orcids.length === 0;

  const handleNextClick = () => {
    setOpenOrcidModal(true);
    handleClose();
  };

  const handleClose = () => {
    setOpenAuthorityModal(false);
    // Set previouslyLoggedIn in localStorage to avoid opening this modal on every login
    localStorage.setItem('previouslyLoggedIn', 'true');
  };

  return (
    <>
      <Modal
        dataTestId="connect-author-modal"
        ariaLabelledBy="connect-author-modal"
        disableEscape={!authority}
        openModal={openAuthorityModal}
        onClose={handleClose}
        headingText={t('profile:authority.connect_authority')}
        maxWidth="lg">
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
      <Modal
        dataTestId="open-orcid-modal"
        ariaLabelledBy="orcid-modal"
        openModal={openOrcidModal}
        onClose={() => setOpenOrcidModal(false)}
        headingIcon={{ src: orcidLogo, alt: 'ORCID iD icon' }}
        headingText={t('profile:orcid.create_or_connect')}>
        <OrcidModalContent />
        <StyledSkipButtonContainer>
          <StyledButton
            data-testid="skip-connect-to-orcid"
            color="default"
            variant="outlined"
            onClick={() => setOpenOrcidModal(false)}>
            {t('profile:orcid.skip_this_step')}
          </StyledButton>
        </StyledSkipButtonContainer>
      </Modal>
    </>
  );
};

export default AuthorityOrcidModal;
