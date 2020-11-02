import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import IconLabelTextLine from '../../components/IconLabelTextLine';
import { User } from '../../types/user.types';
import Card from '../../components/Card';
import { Typography } from '@material-ui/core';

interface UserRolesProps {
  user: User;
}

const UserRoles: FC<UserRolesProps> = ({ user }) => {
  const { t } = useTranslation('profile');
  const { isAppAdmin, isInstitutionAdmin, isEditor, isCurator, isCreator } = user;

  return (
    <Card>
      <Typography variant="h5">{t('heading.roles')}</Typography>
      {!isAppAdmin && !isInstitutionAdmin && !isEditor && !isCurator && !isCreator && (
        <Typography>{t('roles.no_roles')}</Typography>
      )}
      {isAppAdmin && (
        <IconLabelTextLine
          dataTestId="user-role-app-admin"
          icon="settings_applications"
          label={t('roles.app_admin')}
          text={t('roles.app_admin_description')}
        />
      )}
      {isInstitutionAdmin && (
        <IconLabelTextLine
          dataTestId="user-role-institution-admin"
          icon="people"
          label={t('roles.institution_admin')}
          text={t('roles.institution_admin_description')}
        />
      )}
      {isEditor && (
        <IconLabelTextLine
          dataTestId="user-role-editor"
          icon="find_in_page"
          label={t('roles.editor')}
          text={t('roles.editor_description')}
        />
      )}
      {isCurator && (
        <IconLabelTextLine
          dataTestId="user-role-curator"
          icon="all_inbox"
          label={t('roles.curator')}
          text={t('roles.curator_description')}
        />
      )}
      {isCreator && (
        <IconLabelTextLine
          dataTestId="user-role-creator"
          icon="create"
          label={t('roles.creator')}
          text={t('roles.creator_description')}
        />
      )}
    </Card>
  );
};

export default UserRoles;
