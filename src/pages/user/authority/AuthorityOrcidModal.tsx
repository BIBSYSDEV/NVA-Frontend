import React, { FC, useEffect, useRef, useState } from 'react';
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

const AuthorityOrcidModal: FC = () => {
  const { t } = useTranslation('common');
  const user = useSelector((store: RootStore) => store.user);

  const [doNotShowAuthorityModalAgain, setDoNotShowAuthorityModalAgain] = useState(false);
  const [doNotShowOrcidModalAgain, setDoNotShowOrcidModalAgain] = useState(false);

  const [showAuthorityModal, setShowAuthorityModal] = useLocalStorage('showAuthorityModal', true);
  const [showOrcidModal, setShowOrcidModal] = useLocalStorage('showOrcidModal', true);

  const showAuthorityModalRef = useRef(showAuthorityModal);
  const showOrcidModalRef = useRef(showOrcidModal);

  const [openOrcidModal, setOpenOrcidModal] = useState(!!user.authority);

  useEffect(() => {
    setOpenOrcidModal(!!user.authority && !user.orcid);
  }, [user.authority, user.orcid]);

  const handleShowAuthorityModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAuthorityModalAgain(event.target.checked);
    setShowAuthorityModal(!event.target.checked);
  };

  const handleShowOrcidModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowOrcidModalAgain(event.target.checked);
    setShowOrcidModal(!event.target.checked);
  };

  const handleNextClick = () => {
    if (!user.orcid) {
      setOpenOrcidModal(true);
    }
    showAuthorityModalRef.current = false;
  };

  return (
    <>
      {showAuthorityModalRef.current && !user.authority && (
        <Modal
          dataTestId="connect-author-modal"
          ariaLabelledBy="connect-author-modal"
          headingText={t('profile:authority.connect_authority')}>
          <>
            <ConnectAuthority />
            <StyledFooter>
              <FormControlLabel
                control={<Checkbox onChange={handleShowAuthorityModal} checked={doNotShowAuthorityModalAgain} />}
                label={t('do_not_show_again')}
              />
              {!user.orcid && (
                <Button color="primary" variant="contained" onClick={handleNextClick}>
                  {t('next')}
                </Button>
              )}
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
              control={<Checkbox onChange={handleShowOrcidModal} checked={doNotShowOrcidModalAgain} />}
              label={t('do_not_show_again')}
            />
          </StyledFooter>
        </Modal>
      )}
    </>
  );
};

export default AuthorityOrcidModal;
