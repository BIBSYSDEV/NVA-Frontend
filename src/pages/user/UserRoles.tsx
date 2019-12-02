import React from 'react';
import { useTranslation } from 'react-i18next';

import IconLabelTextLine from '../../components/IconLabelTextLine';
import { RoleName, User } from '../../types/user.types';
import UserCard from './UserCard';

interface UserRolesProps {
  user: User;
}

const UserRoles: React.FC<UserRolesProps> = ({ user }) => {
  const { t } = useTranslation('profile');

  const { roles } = user;

  return (
    <UserCard headerLabel={t('heading.roles')} subHeaderLabel={t('info_nva')}>
      {roles &&
        user.roles.map((role: RoleName) => {
          if (role === RoleName.PUBLISHER) {
            return (
              <IconLabelTextLine
                dataTestId="user-role"
                icon={'create'}
                label={t('roles.publisher')}
                text={t('roles.publisher_description')}
                key={role}
              />
            );
          } else if (role === RoleName.CURATOR) {
            return (
              <IconLabelTextLine
                dataTestId="user-role"
                icon="all_inbox"
                label={t('roles.curator')}
                text={t('roles.curator_description')}
                key={role}
              />
            );
          }
          return null;
        })}
    </UserCard>
  );
};

export default UserRoles;
