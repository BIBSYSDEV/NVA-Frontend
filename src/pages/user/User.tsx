import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Link as MuiLink, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { getOrcidInfo } from '../../api/external/orcidApi';
import { setAuthorityData } from '../../redux/actions/userActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import UserInstitution from './UserInstitution';

const StyledUserPage = styled.div`
  display: grid;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'top top' 'secondary-info primary-info' '. primary-info';
    grid-template-columns: 1fr 3fr;
  }
  grid-gap: 3rem;
  font-size: 1rem;
  grid-template-areas: 'top' 'primary-info' 'secondary-info';
`;

const StyledSecondaryUserInfo = styled.div`
  display: grid;
  grid-area: secondary-info;
  grid-template-areas: 'language' 'roles';
  grid-row-gap: 3rem;
`;

const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
  grid-row-gap: 3rem;
`;

const StyledButtonWrapper = styled.div`
  grid-area: top;
  display: flex;
  justify-content: flex-end;
`;

const User: FC = () => {
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

  useEffect(() => {
    const updateOrcid = async () => {
      if (user.authority && !user.authority.orcids.includes(user.externalOrcid)) {
        const updatedAuthority = await addQualifierIdForAuthority(
          user.authority.systemControlNumber,
          AuthorityQualifiers.ORCID,
          user.externalOrcid
        );
        dispatch(setAuthorityData(updatedAuthority));
      }
    };
    if (user.externalOrcid) {
      updateOrcid();
    }
  }, [user.authority, dispatch, user.externalOrcid]);

  return (
    <StyledUserPage>
      {user.authority && (
        <StyledButtonWrapper>
          <Button
            color="primary"
            component={RouterLink}
            to={`/profile/${user.authority.systemControlNumber}`}
            data-testid="public-profile-button">
            {t('workLists:go_to_public_profile')}
          </Button>
        </StyledButtonWrapper>
      )}
      <StyledSecondaryUserInfo>
        <UserLanguage />
        <UserRoles user={user} />
      </StyledSecondaryUserInfo>

      <StyledPrimaryUserInfo>
        <UserInfo user={user} />
        <Card>
          <Heading>{t('heading.author_info')}</Heading>
          {user.authority && user.authority.feideids?.length > 0 && (
            <p data-testid="author-connected-info">{t('authority.connected_info')}</p>
          )}
        </Card>
        <UserOrcid />
        <UserInstitution />
      </StyledPrimaryUserInfo>
    </StyledUserPage>
  );
};

export default User;
