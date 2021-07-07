import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import PeopleIcon from '@material-ui/icons/People';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CreateIcon from '@material-ui/icons/Create';
import { Card } from '../../components/Card';
import { User } from '../../types/user.types';
import { IconLabelTextLine } from '../../components/IconLabelTextLine';

const StyledTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.error.main};
`;

interface UserRolesProps {
  user: User;
}

export const UserRoles = ({ user }: UserRolesProps) => {
  const { t } = useTranslation('profile');
  const { isAppAdmin, isInstitutionAdmin, isEditor, isCurator, isCreator } = user;

  return (
    <Card>
      <Typography variant="h2">{t('heading.roles')}</Typography>
      {user.customerId ? (
        !isAppAdmin &&
        !isInstitutionAdmin &&
        !isEditor &&
        !isCurator &&
        !isCreator && <StyledTypography data-testid="no-roles-text">{t('roles.no_roles')}</StyledTypography>
      ) : (
        <>
          <StyledTypography data-testid="not-customer-text">{t('roles.not_customer')}</StyledTypography>
          <Typography>
            {t('common:name')}: {user.institution}
          </Typography>
          <Typography>
            {t('common:organization_number')}: {user.orgNumber}
          </Typography>
        </>
      )}
      {isAppAdmin && (
        <IconLabelTextLine
          dataTestId="user-role-app-admin"
          icon={<SettingsApplicationsIcon />}
          label={t('roles.app_admin')}
          text={t('roles.app_admin_description')}
        />
      )}
      {isInstitutionAdmin && (
        <IconLabelTextLine
          dataTestId="user-role-institution-admin"
          icon={<PeopleIcon />}
          label={t('roles.institution_admin')}
          text={t('roles.institution_admin_description')}
        />
      )}
      {isEditor && (
        <IconLabelTextLine
          dataTestId="user-role-editor"
          icon={<FindInPageIcon />}
          label={t('roles.editor')}
          text={t('roles.editor_description')}
        />
      )}
      {isCurator && (
        <IconLabelTextLine
          dataTestId="user-role-curator"
          icon={<AllInboxIcon />}
          label={t('roles.curator')}
          text={t('roles.curator_description')}
        />
      )}
      {isCreator && (
        <IconLabelTextLine
          dataTestId="user-role-creator"
          icon={<CreateIcon />}
          label={t('roles.creator')}
          text={t('roles.creator_description')}
        />
      )}
    </Card>
  );
};
