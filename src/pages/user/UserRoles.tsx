import React from 'react';
import { useTranslation } from 'react-i18next';

import IconLabelTextLine from '../../components/IconLabelTextLine';
import { User } from '../../types/user.types';
import Card from '../../components/Card';
import Heading from '../../components/Heading';

interface UserRolesProps {
  user: User;
}

const UserRoles: React.FC<UserRolesProps> = ({ user }) => {
  const { t } = useTranslation('profile');

  return (
    <Card>
      <Heading>{t('heading.roles')}</Heading>
      {user.isCreator && (
        <IconLabelTextLine
          dataTestId="user-role"
          icon="create"
          label={t('roles.publisher')}
          text={t('roles.publisher_description')}
        />
      )}
      {user.isCurator && (
        <IconLabelTextLine
          dataTestId="user-role"
          icon="all_inbox"
          label={t('roles.curator')}
          text={t('roles.curator_description')}
        />
      )}
    </Card>
  );
};

export default UserRoles;
