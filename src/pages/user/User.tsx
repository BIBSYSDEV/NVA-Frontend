import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';

import { Link as MuiLink } from '@material-ui/core';

import { getOrcidInfo } from '../../api/external/orcidApi';
import ButtonModal from '../../components/ButtonModal';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ConnectAuthority } from './authority/ConnectAuthority';
import UserCard from './UserCard';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';

const StyledUserPage = styled.div`
  display: grid;
  @media (min-width: 1000px) {
    grid-template-areas: 'secondary-info primary-info';
    grid-template-columns: 1fr 3fr;
  }
  grid-gap: 3rem;
  font-size: 1rem;
  grid-template-areas: 'primary-info' 'secondary-info';
`;

const StyledSecondaryUserInfo = styled.div`
  display: grid;
  grid-area: secondary-info;
  grid-template-areas: 'profile-image' 'contact-info' 'language' 'author-info';
  grid-row-gap: 3rem;
`;

const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
  grid-row-gap: 3rem;
`;

const User: React.FC = () => {
  const { t } = useTranslation('profile');
  const user = useSelector((state: RootStore) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const orcidAccessToken = new URLSearchParams(location.hash.replace('#', '?')).get('access_token') || '';
    if (orcidAccessToken) {
      dispatch(getOrcidInfo(orcidAccessToken));
      history.push('/user');
    }
  }, [dispatch, location.hash, history]);

  return (
    <StyledUserPage>
      <StyledSecondaryUserInfo>
        <UserCard headerLabel="Bilde" />
        <UserCard headerLabel={t('heading.contact_info')} />
        <UserLanguage />
        <UserCard headerLabel={t('heading.author_info')}>
          {user.authority ? (
            <>
              <p>{t('authority.connected_info')}</p>
              <MuiLink href={user.authority.identifiersMap.handle[0]}>{t('authority.see_profile')}</MuiLink>
            </>
          ) : (
            <>
              <p>{t('authority.not_connected_info')}</p>
              <ButtonModal
                buttonText={t('authority.connect_authority')}
                dataTestId="connect-author-modal"
                ariaLabelledBy="connect-author-modal"
                headingText={t('authority.connect_authority')}>
                <ConnectAuthority />
              </ButtonModal>
            </>
          )}
        </UserCard>
      </StyledSecondaryUserInfo>

      <StyledPrimaryUserInfo>
        <UserInfo user={user} />
        <UserRoles user={user} />
        <UserCard headerLabel={t('heading.organizations')} />
        <UserOrcid />
      </StyledPrimaryUserInfo>
    </StyledUserPage>
  );
};

export default User;
