import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import OrcidModalContent from '../OrcidModalContent';
import Modal from '../../../components/Modal';
import orcidLogo from '../../../resources/images/orcid_logo.svg';

const StyledSkipButtonContainer = styled.div`
  text-align: center;
`;

const StyledButton = styled(Button)`
  max-width: 22rem;
`;

interface OrcidModalProps {
  closeModal: () => void;
}

const OrcidModal: FC<OrcidModalProps> = ({ closeModal }) => {
  const { t } = useTranslation('common');

  return (
    <Modal
      dataTestId="open-orcid-modal"
      ariaLabelledBy="orcid-modal"
      openModal={true}
      onClose={closeModal}
      maxWidth="md"
      headingIcon={{ src: orcidLogo, alt: 'ORCID iD icon' }}
      headingText={t('profile:orcid.create_or_connect')}>
      <OrcidModalContent />
      <StyledSkipButtonContainer>
        <StyledButton data-testid="skip-connect-to-orcid" color="default" variant="outlined" onClick={closeModal}>
          {t('profile:orcid.skip_this_step')}
        </StyledButton>
      </StyledSkipButtonContainer>
    </Modal>
  );
};

export default OrcidModal;
