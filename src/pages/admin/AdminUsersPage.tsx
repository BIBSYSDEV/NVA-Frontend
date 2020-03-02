import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listInstitutionUsers } from '../../api/userApi';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import { UserAdmin, RoleName } from '../../types/user.types';

const AdminUsersPage: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);
  const [userList, setUserList] = useState<UserAdmin[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await listInstitutionUsers(user.institution);
      // TODO backend
      // if (users?.error) {
      //   dispatch(addNotification(t('feedback:error.get_publications'), 'error'));
      // } else {
      setUserList(users);
      // }
    };

    getUsers();
  });

  return (
    <>
      <div>
        <Heading>{t('user_administration')}</Heading>
      </div>
      <div>
        <SubHeading>{t('institution_admins')}</SubHeading>
        {userList
          .filter(user => user.roles.find(role => role === RoleName.ADMIN))
          .map(user => {
            return <div>{user.name}</div>;
          })}
      </div>
      <div>
        <SubHeading>{t('curators')}</SubHeading>
        {userList
          .filter(user => user.roles.find(role => role === RoleName.CURATOR))
          .map(user => {
            return <div>{user.name}</div>;
          })}
      </div>
      <div>
        <SubHeading>{t('editor')}</SubHeading>
        {userList
          .filter(user => user.roles.find(role => role === RoleName.EDITOR))
          .map(user => {
            return <div>{user.name}</div>;
          })}
      </div>
    </>
  );
};

export default AdminUsersPage;
