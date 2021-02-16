import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { addQualifierIdForAuthority, AuthorityQualifiers } from '../../api/authorityApi';
import { getOrcidInfo } from '../../api/external/orcidApi';
import Card from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/actions/notificationActions';
import { setAuthorityData } from '../../redux/actions/userActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { NotificationVariant } from '../../types/notification.types';
import { getUserPath, UrlPathTemplate } from '../../utils/urlPaths';
import UserInfo from './UserInfo';
import UserInstitution from './UserInstitution';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';

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
`;

const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
`;

const StyledButtonWrapper = styled(StyledRightAlignedWrapper)`
  grid-area: top;
`;

const MyProfilePage: FC = () => {
  const { t } = useTranslation('profile');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootStore) => store.user)!; // If user has been empty this route would already be blocked
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const orcidAccessToken = new URLSearchParams(location.hash.replace('#', '?')).get('access_token') || '';
    if (orcidAccessToken) {
      dispatch(getOrcidInfo(orcidAccessToken));
      history.push(UrlPathTemplate.MyProfile);
    }
  }, [dispatch, location.hash, history]);

  useEffect(() => {
    const updateOrcid = async () => {
      if (user.authority?.orcids && !user.authority.orcids.includes(user.externalOrcid)) {
        const updatedAuthority = await addQualifierIdForAuthority(
          user.authority.id,
          AuthorityQualifiers.ORCID,
          user.externalOrcid
        );
        if (updatedAuthority?.error) {
          dispatch(setNotification(updatedAuthority.error, NotificationVariant.Error));
        } else {
          dispatch(setAuthorityData(updatedAuthority));
        }
      }
    };
    if (user.externalOrcid) {
      updateOrcid();
    }
  }, [user.authority, dispatch, user.externalOrcid]);

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('my_profile')}</PageHeader>
      <StyledUserPage>
        {user.authority && (
          <StyledButtonWrapper>
            <Button
              color="primary"
              component={RouterLink}
              to={getUserPath(user.authority.id)}
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
            <Typography variant="h5">{t('heading.author_info')}</Typography>
            {user.authority && user.authority.feideids?.length > 0 && (
              <p data-testid="author-connected-info">{t('authority.connected_info')}</p>
            )}
          </Card>
          <UserOrcid user={user} />
          <UserInstitution user={user} />
        </StyledPrimaryUserInfo>
      </StyledUserPage>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyProfilePage;
