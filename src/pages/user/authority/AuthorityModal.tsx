import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button, Checkbox, FormControlLabel } from '@material-ui/core';

import Modal from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import OrcidModal from '../OrcidModal';
import { ConnectAuthority } from './ConnectAuthority';

const StyledCheckbox = styled(FormControlLabel)`
  margin-top: 2rem;
  align-self: center;
`;

interface AuthorityModalProps {
  showModal: boolean;
}

const AuthorityModal: React.FC<AuthorityModalProps> = ({ showModal }) => {
  const { t } = useTranslation('common');
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [openOrcid, setOpenOrcid] = useState(false);
  const user = useSelector((store: RootStore) => store.user);

  const [showAuthorityModal, setShowAuthorityModal] = useLocalStorage('showAuthorityModal', true);
  const showAuthorityModalRef = useRef(showAuthorityModal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain(event.target.checked);
    setShowAuthorityModal(!event.target.checked);
  };

  const handleNextClick = (_: any) => {
    if (!user.orcid) {
      showAuthorityModalRef.current = false;
      setOpenOrcid(true);
    }
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
            <Button onClick={handleNextClick}>Neste</Button>
            <StyledCheckbox
              control={<Checkbox onChange={handleChange} checked={doNotShowAgain} />}
              label={t('do_not_show_again')}
            />
          </>
        </Modal>
      )}
      {!showAuthorityModalRef.current && openOrcid && (
        <Modal
          dataTestId="open-orcid-modal"
          openModal={showModal}
          ariaLabelledBy="orcid-modal"
          headingText={t('profile:orcid.create_or_connect')}>
          <OrcidModal setOpen={setOpenOrcid} />
        </Modal>
      )}
    </>
  );
};

export default AuthorityModal;
