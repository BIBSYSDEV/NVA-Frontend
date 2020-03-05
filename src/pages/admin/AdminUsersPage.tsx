import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInstitutionUsers } from '../../api/userAdminApi';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UserAdmin, RoleName } from '../../types/user.types';
import styled from 'styled-components';
import Card from '../../components/Card';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import UserList from './UserList';
import NormalText from './../../components/NormalText';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const AdminUsersPage: FC = () => {
  const { t } = useTranslation('admin');
  const user = useSelector((store: RootStore) => store.user);
  const [userList, setUserList] = useState<UserAdmin[]>([]);
  const [autoAssignCreators, setAutoAssignCreators] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getInstitutionUsers(user.institution);
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

  const filterUsersByRole = (roleFilter: RoleName) => {
    return userList.filter(user => user.roles.some(role => role === roleFilter));
  };

  return (
    <Card>
      <Heading>{t('users.user_administration')}</Heading>
      <SubHeading>{t('profile:roles.institution_admins')}</SubHeading>
      <StyledContainer>
        <UserList
          userList={filterUsersByRole(RoleName.ADMIN)}
          role={RoleName.ADMIN}
          buttonText={t('users.new_institution_admin')}
        />
      </StyledContainer>
      <SubHeading>{t('profile:roles.curators')}</SubHeading>
      <StyledContainer>
        <UserList
          userList={filterUsersByRole(RoleName.CURATOR)}
          role={RoleName.CURATOR}
          buttonText={t('users.new_curator')}
        />
      </StyledContainer>
      <SubHeading>{t('profile:roles.editors')}</SubHeading>
      <StyledContainer>
        <UserList
          userList={filterUsersByRole(RoleName.EDITOR)}
          role={RoleName.EDITOR}
          buttonText={t('users.new_editor')}
        />
      </StyledContainer>
      <StyledContainer>
        <SubHeading>{t('profile:roles.creator')}</SubHeading>
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
