import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LabelTextLine from '../../components/LabelTextLine';
import User from '../../types/user.types';
import UserCard from './UserCard';

export interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const [applications, setApplications] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    user.applications.length > 0 && setApplications(user.applications.join(', '));
  }, [user]);

  return (
    <UserCard headerLabel={t('User information')} subHeaderLabel={t('Info from Feide')} className="feide-info">
      <LabelTextLine dataTestId="user-name" label={t('Name')} text={user.name} />
      <LabelTextLine dataTestId="user-id" label={t('ID')} text={user.id} />
      <LabelTextLine dataTestId="user-email" label={t('Email')} text={user.email} />
      <LabelTextLine dataTestId="user-institution" label={t('Institution')} text={user.institution} />
      <LabelTextLine dataTestId="user-applications" label={t('Applications')} text={applications} />
    </UserCard>
  );
};

export default UserInfo;
