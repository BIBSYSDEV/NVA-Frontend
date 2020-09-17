import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LabelTextLine from '../../components/LabelTextLine';
import { User } from '../../types/user.types';
import Card from '../../components/Card';
import { Typography } from '@material-ui/core';

interface UserInfoProps {
  user: User;
}

const UserInfo: FC<UserInfoProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Typography variant="h5">{t('profile:heading.user_info')}</Typography>
      <LabelTextLine dataTestId="user-name" label={t('common:name')}>
        {user.name}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-id" label={t('profile:id')}>
        {user.id}
      </LabelTextLine>
      <LabelTextLine dataTestId="user-email" label={t('common:email')}>
        {user.email}
      </LabelTextLine>
    </Card>
  );
};

export default UserInfo;
