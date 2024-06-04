import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { User } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface UserRolesProps {
  user: User;
  hasActiveEmployment: boolean;
}

export const UserRoles = ({ user, hasActiveEmployment }: UserRolesProps) => {
  const { t } = useTranslation();
  const {
    isAppAdmin,
    isInstitutionAdmin,
    isEditor,
    isDoiCurator,
    isPublishingCurator,
    isSupportCurator,
    isCreator,
    isInternalImporter,
    isNviCurator,
  } = user;

  const hasAnyRole =
    isAppAdmin ||
    isInstitutionAdmin ||
    isEditor ||
    isDoiCurator ||
    isPublishingCurator ||
    isSupportCurator ||
    isCreator ||
    isInternalImporter ||
    isNviCurator;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Typography variant="h3">{t('my_page.my_profile.heading.roles')}</Typography>
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
        <Typography data-testid={dataTestId.myPage.myProfile.noActiveEmploymentsText} sx={{ color: 'error.main' }}>
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
      {isPublishingCurator && (
        <RoleItem
          dataTestId="user-role-publishing-curator"
          label={t('my_page.roles.publishing_curator')}
          text={t('my_page.roles.publishing_curator_description')}
        />
      )}
      {isDoiCurator && (
        <RoleItem
          dataTestId="user-role-doi-curator"
          label={t('my_page.roles.doi_curator')}
          text={t('my_page.roles.doi_curator_description')}
        />
      )}
      {isSupportCurator && (
        <RoleItem
          dataTestId="user-role-support-curator"
          label={t('my_page.roles.support_curator')}
          text={t('my_page.roles.support_curator_description')}
        />
      )}
      {isNviCurator && (
        <RoleItem
          dataTestId="user-role-nvi-curator"
          label={t('my_page.roles.nvi_curator')}
          text={t('my_page.roles.nvi_curator_description')}
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
      {isInternalImporter && (
        <RoleItem
          dataTestId="user-role-internal-importer"
          label={t('my_page.roles.internal_importer')}
          text={t('my_page.roles.internal_importer_description')}
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
    <Typography variant="h4" sx={{ gridArea: 'label' }}>
      {label}
    </Typography>
    <Typography gutterBottom sx={{ gridArea: 'text' }}>
      {text}
    </Typography>
  </Box>
);
