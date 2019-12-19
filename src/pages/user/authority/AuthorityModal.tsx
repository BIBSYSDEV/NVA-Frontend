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

const StyledFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

interface AuthorityModalProps {
  showModal: boolean;
}

const AuthorityModal: React.FC<AuthorityModalProps> = ({ showModal }) => {
  const { t } = useTranslation('common');
  const user = useSelector((store: RootStore) => store.user);

  const [doNotShowAgain, setDoNotShowAgain] = useState({
    authorityModal: false,
    orcidModal: false,
  });

  const [openOrcidModal, setOpenOrcidModal] = useState(false);

  const [showAuthorityModal, setShowAuthorityModal] = useLocalStorage('showAuthorityModal', true);
  const [showOrcidModal, setShowOrcidModal] = useLocalStorage('showOrcidModal', true);

  const showAuthorityModalRef = useRef(showAuthorityModal);
  const showOrcidModalRef = useRef(showOrcidModal);

  const handleDoNotShow = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAgain({ ...doNotShowAgain, [name]: event?.target.checked });
  };

  const handleShowAuthorityModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoNotShow('authorityModal');
    setShowAuthorityModal(!event.target.checked);
  };

  const handleShowOrcidModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoNotShow('orcidModal');
    setShowOrcidModal(!event.target.checked);
  };

  const handleNextClick = (_: any) => {
    if (!user.orcid) {
      setOpenOrcidModal(true);
    }
    showAuthorityModalRef.current = false;
  };

  return (
    <>
      {showAuthorityModalRef.current && showModal && (
        <Modal
          dataTestId="connect-author-modal"
          ariaLabelledBy="connect-author-modal"
          headingText={t('profile:authority.connect_authority')}>
          <>
            <ConnectAuthority />
            <StyledFooter>
              <FormControlLabel
                control={<Checkbox onChange={handleShowAuthorityModal} checked={doNotShowAgain.authorityModal} />}
                label={t('do_not_show_again')}
              />
              <Button color="primary" variant="contained" onClick={handleNextClick}>
                {t('next')}
              </Button>
            </StyledFooter>
          </>
        </Modal>
      )}
      {showOrcidModalRef.current && openOrcidModal && (
        <Modal
          dataTestId="open-orcid-modal"
          ariaLabelledBy="orcid-modal"
          headingText={t('profile:orcid.create_or_connect')}>
          <OrcidModal />
          <StyledFooter>
            <FormControlLabel
              control={<Checkbox onChange={handleShowOrcidModal} checked={doNotShowAgain.orcidModal} />}
              label={t('common:do_not_show_again')}
            />
          </StyledFooter>
        </Modal>
      )}
    </>
  );
};

export default AuthorityModal;
