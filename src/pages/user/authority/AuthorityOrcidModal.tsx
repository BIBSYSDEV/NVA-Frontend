import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import Modal from '../../../components/Modal';
import { RootStore } from '../../../redux/reducers/rootReducer';
import orcidLogo from '../../../resources/images/orcid_logo.svg';
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

const StyledButton = styled(Button)`
  width: 22rem;
`;

const AuthorityOrcidModal: FC = () => {
  const { t } = useTranslation('common');
  const user = useSelector((store: RootStore) => store.user);
  const { location } = useHistory();

  const noOrcid = user.authority?.orcids === undefined || user.authority?.orcids.length === 0;
  const noAuthority = user.authority?.systemControlNumber === '';
  const onHomePage = location.pathname === '/';

  const [openOrcidModal, setOpenOrcidModal] = useState(!noAuthority && noOrcid && onHomePage);
  const [openAuthorityModal, setOpenAuthorityModal] = useState(noAuthority && onHomePage);

  useEffect(() => {
    setOpenOrcidModal(!noAuthority && noOrcid && onHomePage);
    setOpenAuthorityModal(noAuthority && onHomePage);
  }, [noAuthority, noOrcid, onHomePage]);

  const handleNextClick = () => {
    setOpenOrcidModal(true);
    setOpenAuthorityModal(false);
  };

  return (
    <>
      <Modal
        dataTestId="connect-author-modal"
        disableEscape
        openModal={openAuthorityModal}
        onClose={() => setOpenAuthorityModal(false)}
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
      <Modal
        dataTestId="open-orcid-modal"
        ariaLabelledBy="orcid-modal"
        openModal={openOrcidModal}
        onClose={() => setOpenOrcidModal(false)}
        headingIcon={{ src: orcidLogo, alt: 'ORCID iD icon' }}
        headingText={t('profile:orcid.create_or_connect')}>
        <OrcidModal />
        <StyledSkipButtonContainer>
          <StyledButton color="default" variant="outlined" onClick={() => setOpenOrcidModal(false)}>
            {t('profile:orcid.skip_this_step')}
          </StyledButton>
        </StyledSkipButtonContainer>
      </Modal>
    </>
  );
};

export default AuthorityOrcidModal;
