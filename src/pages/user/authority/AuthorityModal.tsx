import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControlLabel } from '@material-ui/core';

import Modal from '../../../components/Modal';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import { ConnectAuthority } from './ConnectAuthority';

const StyledCheckbox = styled(FormControlLabel)`
  margin-top: 2rem;
  align-self: center;
`;

interface AuthorityModalProps {
  showModal: boolean;
}

const AuthorityModal: React.FC<AuthorityModalProps> = ({ showModal }) => {
  const { t } = useTranslation();
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [showAuthorityModal, setShowAuthorityModal] = useLocalStorage('showAuthorityModal', true);
  const showAuthorityModalRef = useRef(showAuthorityModal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain(event.target.checked);
    setShowAuthorityModal(!event.target.checked);
  };

  return (
    <>
      {showModal && showAuthorityModalRef.current && (
        <Modal
          dataTestId="connect-author-modal"
          openModal={showModal}
          ariaLabelledBy="connect-author-modal"
          headingText={t('profile:authority.connect_authority')}>
          <>
            <ConnectAuthority />
            <StyledCheckbox
              control={<Checkbox onChange={handleChange} checked={doNotShowAgain} />}
              label={t('do_not_show_again')}
            />
          </>
        </Modal>
      )}
    </>
  );
};

export default AuthorityModal;
