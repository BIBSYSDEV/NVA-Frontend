import React from 'react';
import { useTranslation } from 'react-i18next';

import LabelTextLine from '../../components/LabelTextLine';
import { User } from '../../types/user.types';
import UserCard from './UserCard';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <UserCard headerLabel={t('profile:heading.user_info')} subHeaderLabel={t('profile:info_feide')}>
      <LabelTextLine dataTestId="user-name" label={t('common:name')} text={user.name} />
      <LabelTextLine dataTestId="user-id" label={t('profile:id')} text={user.id} />
      <LabelTextLine dataTestId="user-email" label={t('profile:email')} text={user.email} />
      <LabelTextLine dataTestId="user-institution" label={t('Institution')} text={user.institution} />
      <LabelTextLine dataTestId="user-applications" label={t('profile:applications')} text={user.application} />
    </UserCard>
  );
};

export default UserInfo;
