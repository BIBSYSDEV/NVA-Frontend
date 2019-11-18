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
    <UserCard headerLabel={t('User information')} subHeaderLabel={t('Info from Feide')}>
      <LabelTextLine dataTestId="user-name" label={t('Name')} text={user.name} />
      <LabelTextLine dataTestId="user-id" label={t('ID')} text={user.id} />
      <LabelTextLine dataTestId="user-email" label={t('Email')} text={user.email} />
      <LabelTextLine dataTestId="user-institution" label={t('Institution')} text={user.institution} />
      <LabelTextLine dataTestId="user-applications" label={t('Applications')} text={user.application} />
    </UserCard>
  );
};

export default UserInfo;
