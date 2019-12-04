import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Link as MuiLink } from '@material-ui/core';

import { getOrcidInfo } from '../../api/orcidApi';
import { orcidSignInFailure } from '../../redux/actions/orcidActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import UserCard from './UserCard';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';

const StyledUserPage = styled.div`
  display: grid;
  grid-template-areas: 'secondary-info primary-info';
  grid-template-columns: 1fr 3fr;
  grid-gap: 3rem;
  font-size: 1rem;
`;

const StyledSecondaryUserInfo = styled.div`
  display: grid;
  grid-area: secondary-info;
  grid-template-areas: 'profile-image' 'contact-info' 'language' 'author-info';
  grid-row-gap: 3rem;
  min-width: 20rem;
`;

const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
  grid-gap: 3rem;
`;

const User: React.FC = () => {
  const { t } = useTranslation('profile');
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const orcidCode = query.get('code') || '';
    const error = query.get('error') || '';
    if (error) {
      dispatch(orcidSignInFailure(t('feedback:error.orcid_login')));
      history.push('/user');
    } else if (orcidCode) {
      dispatch(getOrcidInfo(orcidCode));
      history.push('/user');
    }
  }, [t, history, location.search, dispatch]);

  const user = useSelector((state: RootStore) => state.user);

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
              <Link to="/user/authority">
                <Button color="primary" variant="contained">
                  {t('authority.connect_authority')}
                </Button>
              </Link>
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
