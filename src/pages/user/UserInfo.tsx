import React from 'react';
import { useTranslation } from 'react-i18next';

import LabelTextLine from '../../components/LabelTextLine';
import { User } from '../../types/user.types';
import Heading from '../../components/Heading';
import SubHeading from '../../components/SubHeading';
import Card from '../../components/Card';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Heading>{t('profile:heading.user_info')}</Heading>
      <SubHeading>{t('profile:info_feide')}</SubHeading>
      <LabelTextLine dataTestId="user-name" label={t('common:name')} text={user.name} />
      <LabelTextLine dataTestId="user-id" label={t('profile:id')} text={user.id} />
      <LabelTextLine dataTestId="user-email" label={t('common:email')} text={user.email} />
    </Card>
  );
};

export default UserInfo;
