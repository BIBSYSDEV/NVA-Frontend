import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { RootStore } from '../../redux/reducers/rootReducer';
import { getUserPath } from '../../utils/urlPaths';
import { UserInfo } from './UserInfo';
import { UserOrcid } from './UserOrcid';
import { UserRoles } from './UserRoles';
import { UserAffiliations } from './UserAffiliations';

const StyledUserPage = styled.div`
  display: grid;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'top top' 'secondary-info primary-info' '. primary-info';
    grid-template-columns: 1fr 3fr;
  }
  grid-gap: 2rem;
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

const MyProfilePage = () => {
  const { t } = useTranslation('profile');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const user = useSelector((store: RootStore) => store.user)!; // If user has been empty this route would already be blocked

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
          <UserRoles user={user} />
        </StyledSecondaryUserInfo>

        <StyledPrimaryUserInfo>
          <UserInfo user={user} />
          <UserOrcid user={user} />
          <UserAffiliations user={user} />
        </StyledPrimaryUserInfo>
      </StyledUserPage>
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyProfilePage;
