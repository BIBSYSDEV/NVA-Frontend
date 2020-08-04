import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { RoleName } from '../../types/user.types';
import styled from 'styled-components';
import Card from '../../components/Card';
import { FormControlLabel, Checkbox, Divider, CircularProgress } from '@material-ui/core';
import UserList from './UserList';
import NormalText from './../../components/NormalText';
import useFetchUsersForInstitution from '../../utils/hooks/useFetchUsersForInstitution';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { filterUsersByRole } from '../../utils/role-helpers';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledHeading = styled(Heading)`
  margin-bottom: 2rem;
`;

const AdminUsersPage: FC = () => {
  const { t } = useTranslation('admin');
  const user = useSelector((store: RootStore) => store.user);
  const [users, isLoading] = useFetchUsersForInstitution(user.institution);
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  return (
    <Card>
      <StyledHeading>{t('users.user_administration')}</StyledHeading>

      <StyledContainer>
        <SubHeading>{t('profile:roles.institution_admins')}</SubHeading>
        <Divider />
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : users.length > 0 ? (
          <UserList
            userList={filterUsersByRole(users, RoleName.INSTITUTION_ADMIN)}
            role={RoleName.INSTITUTION_ADMIN}
            buttonText={t('users.new_institution_admin')}
          />
        ) : (
          <NormalText>
            <i>{t('users.no_users_found')}</i>
          </NormalText>
        )}
      </StyledContainer>

      <StyledContainer>
        <SubHeading>{t('profile:roles.curators')}</SubHeading>
        <Divider />
        {isLoading ? (
          <StyledProgressWrapper>
            <CircularProgress />
          </StyledProgressWrapper>
        ) : users.length > 0 ? (
          <UserList
            userList={filterUsersByRole(users, RoleName.CURATOR)}
            role={RoleName.CURATOR}
            buttonText={t('users.new_curator')}
          />
        ) : (
          <NormalText>
            <i>{t('users.no_users_found')}</i>
          </NormalText>
        )}
      </StyledContainer>

      <StyledContainer>
        <SubHeading>{t('profile:roles.creator')}</SubHeading>
        <Divider />
        <NormalText>{t('users.creator_info')}</NormalText>
        <FormControlLabel
          control={<Checkbox disabled checked={autoAssignCreators} />}
          onChange={handleCheckAutoAssignCreators}
          label={t('users.auto_assign_creators')}
        />
      </StyledContainer>
    </Card>
  );
};

export default AdminUsersPage;
