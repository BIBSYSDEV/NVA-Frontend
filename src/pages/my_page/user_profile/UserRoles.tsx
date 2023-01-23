import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { User } from '../../../types/user.types';

interface UserRolesProps {
  user: User;
  hasActiveEmployment: boolean;
}

export const UserRoles = ({ user, hasActiveEmployment }: UserRolesProps) => {
  const { t } = useTranslation();
  const { isAppAdmin, isInstitutionAdmin, isEditor, isCurator, isCreator } = user;
  const hasAnyRole = isAppAdmin || isInstitutionAdmin || isCurator || isEditor || isCreator;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Typography variant="h2">{t('my_page.my_profile.heading.roles')}</Typography>
      {user.customerId ? (
        !hasAnyRole && (
          <Typography data-testid="no-roles-text" sx={{ color: 'error.main' }}>
            {t('my_page.roles.no_roles')}
          </Typography>
        )
      ) : hasActiveEmployment ? (
        <Typography data-testid="not-customer-text" sx={{ color: 'error.main' }}>
          {t('my_page.roles.not_customer')}
        </Typography>
      ) : (
        <Typography data-testid="no-active-employments-text" sx={{ color: 'error.main' }}>
          {t('my_page.roles.no_active_employments')}
        </Typography>
      )}
      {isCreator && (
        <RoleItem
          dataTestId="user-role-creator"
          label={t('my_page.roles.creator')}
          text={t('my_page.roles.creator_description')}
        />
      )}
      {isCurator && (
        <RoleItem
          dataTestId="user-role-curator"
          label={t('my_page.roles.curator')}
          text={t('my_page.roles.curator_description')}
        />
      )}
      {isEditor && (
        <RoleItem
          dataTestId="user-role-editor"
          label={t('my_page.roles.editor')}
          text={t('my_page.roles.editor_description')}
        />
      )}
      {isInstitutionAdmin && (
        <RoleItem
          dataTestId="user-role-institution-admin"
          label={t('my_page.roles.institution_admin')}
          text={t('my_page.roles.institution_admin_description')}
        />
      )}
      {isAppAdmin && (
        <RoleItem
          dataTestId="user-role-app-admin"
          label={t('my_page.roles.app_admin')}
          text={t('my_page.roles.app_admin_description')}
        />
      )}
    </Box>
  );
};

interface IconLabelTextLineProps {
  dataTestId?: string;
  label: string;
  text: string;
}

const RoleItem = ({ dataTestId, label, text }: IconLabelTextLineProps) => (
  <Box
    data-testid={dataTestId}
    sx={{
      bgcolor: 'secondary.dark',
      p: '0.5rem',
      display: 'grid',
      gridTemplateAreas: "'role label' 'text text'",
      gridTemplateColumns: 'auto 1fr',
      borderRadius: '1px',
    }}>
    <Typography component="h3" variant="body1" sx={{ gridArea: 'label', fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Typography gutterBottom sx={{ gridArea: 'text' }}>
      {text}
    </Typography>
  </Box>
);
