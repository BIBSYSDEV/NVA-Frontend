import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import Modal from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import useLocalStorage from '../../../utils/hooks/useLocalStorage';
import OrcidModal from '../OrcidModal';
import { ConnectAuthority } from './ConnectAuthority';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const StyledSkipButtonContainer = styled.div`
  text-align: center;
`;

const AuthorityOrcidModal: FC = () => {
  const { t } = useTranslation('common');
  const user = useSelector((store: RootStore) => store.user);
  const { location } = useHistory();

  const noOrcid = user.authority?.orcids.length === 0;
  const noFeide = user.authority?.feideids.length === 0;
  const noAuthority = user.authority?.systemControlNumber === '';
  const onHomePage = location.pathname === '/';

  const [openOrcidModal, setOpenOrcidModal] = useState(!noFeide && noOrcid && onHomePage);
  const [openAuthorityModal, setOpenAuthorityModal] = useState(noFeide && onHomePage);

  useEffect(() => {
    setOpenOrcidModal(!noFeide && noOrcid && onHomePage);
    setOpenAuthorityModal(noFeide && onHomePage);
  }, [noFeide, noOrcid, onHomePage]);

  const handleNextClick = () => {
    if (noOrcid) {
      setOpenOrcidModal(true);
    }
    setOpenAuthorityModal(false);
  };

  return (
    <>
      {openAuthorityModal && (
        <Modal
          dataTestId="connect-author-modal"
          disabledEscape
          ariaLabelledBy="connect-author-modal"
          headingText={t('profile:authority.connect_authority')}>
          <>
            <ConnectAuthority />
            {noOrcid && (
              <StyledButtonContainer>
                <Button color="primary" variant="contained" onClick={handleNextClick} disabled={noAuthority}>
                  {t('next')}
                </Button>
              </StyledButtonContainer>
            )}
          </>
        </Modal>
      )}
      {openOrcidModal && (
        <Modal
          dataTestId="open-orcid-modal"
          ariaLabelledBy="orcid-modal"
          headingIcon={{ src: 'https://orcid.org/sites/default/files/images/orcid_24x24.png', alt: 'ORCID iD icon' }}
          headingText={t('profile:orcid.create_or_connect')}>
          <OrcidModal />
          <StyledSkipButtonContainer>
            <Button color="secondary" variant="outlined" onClick={() => setOpenOrcidModal(false)}>
              {t('profile:orcid.skip_this_step')}
            </Button>
          </StyledSkipButtonContainer>
        </Modal>
      )}
    </>
  );
};

export default AuthorityOrcidModal;
