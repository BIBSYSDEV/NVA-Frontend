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
import { FormControlLabel, Checkbox, Divider } from '@material-ui/core';
import UserList from './UserList';
import NormalText from './../../components/NormalText';

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledHeading = styled(Heading)`
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
    return userList.filter((user) => user.roles.some((role) => role === roleFilter));
  };

  return (
    <Card>
      <StyledHeading>{t('users.user_administration')}</StyledHeading>

      <StyledContainer>
        <SubHeading>{t('profile:roles.institution_admins')}</SubHeading>
        <Divider />
        <UserList
          userList={filterUsersByRole(RoleName.INSTITUTION_ADMIN)}
          role={RoleName.INSTITUTION_ADMIN}
          buttonText={t('users.new_institution_admin')}
        />
      </StyledContainer>

      <StyledContainer>
        <SubHeading>{t('profile:roles.curators')}</SubHeading>
        <Divider />
        <UserList
          userList={filterUsersByRole(RoleName.CURATOR)}
          role={RoleName.CURATOR}
          buttonText={t('users.new_curator')}
        />
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
