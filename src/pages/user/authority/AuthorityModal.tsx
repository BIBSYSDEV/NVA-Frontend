import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Checkbox, FormControlLabel } from '@material-ui/core';

import ButtonModal from '../../../components/ButtonModal';
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
  const [checked, setChecked] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useLocalStorage('doNotShowAgain', { connectAuthorityModal: false });
  const localStorageRef = useRef(!doNotShowAgain.connectAuthorityModal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setDoNotShowAgain({ connectAuthorityModal: event.target.checked });
  };

  return (
    <>
      {showModal && localStorageRef.current && (
        <ButtonModal
          dataTestId="connect-author-modal"
          openModal={showModal}
          ariaLabelledBy="connect-author-modal"
          headingText={t('profile:authority.connect_authority')}>
          {() => (
            <>
              <ConnectAuthority />
              <StyledCheckbox
                control={<Checkbox onChange={handleChange} checked={checked} />}
                label={t('do_not_show_again')}
              />
            </>
          )}
        </ButtonModal>
      )}
    </>
  );
};

export default AuthorityModal;
