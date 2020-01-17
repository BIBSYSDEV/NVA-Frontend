import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
  const { location } = useHistory();

  const noOrcid = user.authority?.orcids.length === 0;
  const noFeide = user.authority?.feideids.length === 0;

  const [doNotShowAuthorityModalAgain, setDoNotShowAuthorityModalAgain] = useState(false);
  const [doNotShowOrcidModalAgain, setDoNotShowOrcidModalAgain] = useState(false);

  const [showAuthorityModal, setShowAuthorityModal] = useLocalStorage('showAuthorityModal', true);
  const [showOrcidModal, setShowOrcidModal] = useLocalStorage('showOrcidModal', true);

  const showAuthorityModalRef = useRef(showAuthorityModal);
  const showOrcidModalRef = useRef(showOrcidModal);

  const [openOrcidModal, setOpenOrcidModal] = useState(!noFeide && noOrcid);
  const [openAuthorityModal, setOpenAuthorityModal] = useState(noFeide);

  useEffect(() => {
    if (location.pathname !== '/') {
      setOpenOrcidModal(false);
      setOpenAuthorityModal(false);
    }
  }, [location]);

  useEffect(() => {
    setOpenOrcidModal(!noFeide && noOrcid);
  }, [noFeide, noOrcid]);

  const handleShowAuthorityModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowAuthorityModalAgain(event.target.checked);
    setShowAuthorityModal(!event.target.checked);
  };

  const handleShowOrcidModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoNotShowOrcidModalAgain(event.target.checked);
    setShowOrcidModal(!event.target.checked);
  };

  const handleNextClick = () => {
    if (noOrcid) {
      setOpenOrcidModal(true);
    }
    showAuthorityModalRef.current = false;
  };

  return (
    <>
      {showAuthorityModalRef.current && openAuthorityModal && noFeide && (
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
              {noOrcid && (
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
