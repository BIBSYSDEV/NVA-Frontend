import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import PeopleIcon from '@mui/icons-material/People';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import CreateIcon from '@mui/icons-material/Create';
import { User } from '../../types/user.types';
import { BackgroundDiv } from '../../components/styled/Wrappers';

interface UserRolesProps {
  user: User;
}

export const UserRoles = ({ user }: UserRolesProps) => {
  const { t } = useTranslation('profile');
  const { isAppAdmin, isInstitutionAdmin, isEditor, isCurator, isCreator } = user;

  return (
    <BackgroundDiv>
      <Typography variant="h2">{t('heading.roles')}</Typography>
      {user.customerId ? (
        !isAppAdmin &&
        !isInstitutionAdmin &&
        !isEditor &&
        !isCurator &&
        !isCreator && (
          <Typography data-testid="no-roles-text" sx={{ color: 'error.main' }}>
            {t('roles.no_roles')}
          </Typography>
        )
      ) : (
        <Typography data-testid="not-customer-text" sx={{ color: 'error.main' }}>
          {t('roles.not_customer')}
        </Typography>
      )}
      {isAppAdmin && (
        <RoleItem
          dataTestId="user-role-app-admin"
          icon={<SettingsApplicationsIcon />}
          label={t('roles.app_admin')}
          text={t('roles.app_admin_description')}
        />
      )}
      {isInstitutionAdmin && (
        <RoleItem
          dataTestId="user-role-institution-admin"
          icon={<PeopleIcon />}
          label={t('roles.institution_admin')}
          text={t('roles.institution_admin_description')}
        />
      )}
      {isEditor && (
        <RoleItem
          dataTestId="user-role-editor"
          icon={<FindInPageIcon />}
          label={t('roles.editor')}
          text={t('roles.editor_description')}
        />
      )}
      {isCurator && (
        <RoleItem
          dataTestId="user-role-curator"
          icon={<AllInboxIcon />}
          label={t('roles.curator')}
          text={t('roles.curator_description')}
        />
      )}
      {isCreator && (
        <RoleItem
          dataTestId="user-role-creator"
          icon={<CreateIcon />}
          label={t('roles.creator')}
          text={t('roles.creator_description')}
        />
      )}
    </BackgroundDiv>
  );
};

interface IconLabelTextLineProps {
  dataTestId?: string;
  icon: ReactNode;
  label: string;
  text: string;
}

const RoleItem = ({ dataTestId, icon, label, text }: IconLabelTextLineProps) => (
  <Box
    data-testid={dataTestId}
    sx={{
      pt: '0.8rem',
      display: 'grid',
      gridTemplateAreas: "'icon label' 'text text'",
      gridTemplateColumns: 'auto 1fr',
      columnGap: '0.5rem',
      borderBottom: '1px solid',
      '&:first-of-type': {
        borderTop: '1px solid',
      },
    }}>
    <Box sx={{ gridArea: 'icon' }}>{icon}</Box>
    <Typography variantMapping={{ body1: 'h3' }} sx={{ gridArea: 'label', fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Typography gutterBottom sx={{ gridArea: 'text' }}>
      {text}
    </Typography>
  </Box>
);
