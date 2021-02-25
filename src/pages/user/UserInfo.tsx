import React from 'react';
import { useTranslation } from 'react-i18next';
import LabelTextLine from '../../components/LabelTextLine';
import { User } from '../../types/user.types';
import Card from '../../components/Card';
import { Typography } from '@material-ui/core';

interface UserInfoProps {
  user: User;
}

export const UserInfo = ({ user }: UserInfoProps) => {
  const { t } = useTranslation('profile');

  return (
    <Card>
      <Typography variant="h2">{t('heading.user_info')}</Typography>
      <LabelTextLine dataTestId="user-name" label={t('common:name')}>
        {user.name}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-id" label={t('id')}>
        {user.id}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-email" label={t('common:email')}>
        {user.email}
      </LabelTextLine>
    </Card>
  );
};
