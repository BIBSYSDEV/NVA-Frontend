import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listInstitutionUsers } from '../../api/userApi';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UserAdmin, RoleName } from '../../types/user.types';
import styled from 'styled-components';
import Card from '../../components/Card';
import { Button, FormControlLabel, Checkbox } from '@material-ui/core';
import UserList from './UserList';
import NormalText from './../../components/NormalText';

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const AdminUsersPage: FC = () => {
  const { t } = useTranslation('profile');
  const user = useSelector((store: RootStore) => store.user);
  const [userList, setUserList] = useState<UserAdmin[]>([]);
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const users = await listInstitutionUsers(user.institution);
      console.log(users);
      // TODO backend
      // if (users?.error) {
      //   dispatch(addNotification(t('feedback:error.get_publications'), 'error'));
      // } else {
      setUserList(users);
      // }
    };

    getUsers();
  }, [user.institution]);

  const handleCheckAutoAssignCreators = () => {
    setAutoAssignCreators(!autoAssignCreators);
  };

  return (
    <Card>
      <Heading>{t('organization.user_administration')}</Heading>
      <SubHeading>{t('roles.institution_admins')}</SubHeading>
      <StyledContainer>
        {userList.filter(user => user.roles.find(role => role === RoleName.ADMIN)) && (
          <UserList userList={userList.filter(user => user.roles.find(role => role === RoleName.ADMIN))} />
        )}
        <StyledButton color="primary" variant="outlined">
          {t('users.new_institution_admin')}
        </StyledButton>
      </StyledContainer>
      <SubHeading>{t('roles.curators')}</SubHeading>
      <StyledContainer>
        {userList.filter(user => user.roles.find(role => role === RoleName.CURATOR)) && (
          <UserList userList={userList.filter(user => user.roles.find(role => role === RoleName.CURATOR))} />
        )}
        <StyledButton color="primary" variant="outlined">
          {t('users.new_curator')}
        </StyledButton>
      </StyledContainer>
      <SubHeading>{t('roles.editors')}</SubHeading>
      <StyledContainer>
        {userList.filter(user => user.roles.find(role => role === RoleName.EDITOR)) && (
          <UserList userList={userList.filter(user => user.roles.find(role => role === RoleName.EDITOR))} />
        )}
        <StyledButton color="primary" variant="outlined">
          {t('users.new_editor')}
        </StyledButton>
      </StyledContainer>
      <StyledContainer>
        <SubHeading>{t('roles.creator')}</SubHeading>
        <NormalText>{t('users.creator_info')}</NormalText>
        <FormControlLabel
          control={<Checkbox checked={autoAssignCreators} />}
          onChange={handleCheckAutoAssignCreators}
          label={t('users.auto_assign_creators')}
        />
      </StyledContainer>
    </Card>
  );
};

export default AdminUsersPage;
