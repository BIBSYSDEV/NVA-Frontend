import React from 'react';
import { useTranslation } from 'react-i18next';

import IconLabelTextLine from '../../components/IconLabelTextLine';
import User, { RoleName } from '../../types/user.types';
import UserCard from './UserCard';

interface UserRolesProps {
  user: User;
}

const UserRoles: React.FC<UserRolesProps> = ({ user }) => {
  const { t } = useTranslation();

  const { roles } = user;

  return (
    <UserCard headerLabel={t('Roles')} subHeaderLabel={t('Info from NVA')}>
      {roles &&
        user.roles.map((role: RoleName) => {
          if (role === RoleName.PUBLISHER) {
            return (
              <IconLabelTextLine
                dataTestId="user-role"
                icon={'create'}
                label={role}
                text={t('RoleDescription.Publisher')}
                key={role}
              />
            );
          } else if (role === RoleName.CURATOR) {
            return (
              <IconLabelTextLine
                dataTestId="user-role"
                icon="all_inbox"
                label={role}
                text={t('RoleDescription.Curator')}
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
