import { Box, CircularProgress, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../api/commonApi';
import { fetchUsers } from '../../api/roleApi';
import { ProfilePicture } from '../../components/ProfilePicture';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { Organization } from '../../types/organization.types';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { getFullName } from '../../utils/user-helpers';

export const EditorInstitution = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [customer, isLoadingCustomer] = useFetch<CustomerInstitution>({
    url: user?.customerId ? user.customerId : '',
    errorMessage: t('feedback.error.get_customer'),
    withAuthentication: true,
  });
  const customerId = customer?.id ?? '';
  const [institution, isLoadingInstitution] = useFetchResource<Organization>(
    user?.topOrgCristinId ? user.topOrgCristinId : '',
    t('feedback.error.get_institution')
  );

  const institutionId = user?.topOrgCristinId ?? '';

  const organizationQuery = useQuery({
    queryKey: [institutionId],
    queryFn: () => getById<Organization>(institutionId),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const institutionUsersQuery = useQuery({
    queryKey: ['institutionUsers', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, [RoleName.Editor, RoleName.InstitutionAdmin]) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const institutionUsers = institutionUsersQuery.data ?? [];

  const institutionAdmins = institutionUsers.filter((user) =>
    user.roles.some((role) => role.rolename === RoleName.InstitutionAdmin)
  );

  const institutionEditors = institutionUsers.filter((user) =>
    user.roles.some((role) => role.rolename === RoleName.Editor)
  );

  return (
    <>
      <Helmet>
        <title>{t('editor.institution.institution_profile')}</title>
      </Helmet>
      {isLoadingCustomer || isLoadingInstitution ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h3" component="h2">
            {t('editor.institution.institution_name_norwegian')}
          </Typography>
          <Typography paragraph>{institution?.labels.nb ?? '-'}</Typography>

          <Typography variant="h3" component="h2">
            {t('editor.institution.institution_name_english')}
          </Typography>
          <Typography paragraph>{institution?.labels.en ?? '-'}</Typography>

          <Typography variant="h3" component="h2">
            {t('editor.institution.institution_short_name')}
          </Typography>
          <Typography paragraph>{organizationQuery.data?.acronym ?? '-'}</Typography>

          <Typography variant="h3" component="h2">
            {t('editor.institution.institution_code')}
          </Typography>
          <Typography paragraph>{institution?.id.split('/').pop() ?? '-'}</Typography>

          <Typography variant="h3" component="h2">
            {t('basic_data.institutions.ror')}
          </Typography>
          <Typography paragraph>
            {customer?.rorId ? (
              <Link href={customer.rorId} target="_blank" rel="noopener noreferrer">
                {customer.rorId}
              </Link>
            ) : (
              '-'
            )}
          </Typography>

          <Typography variant="h3" component="h2">
            {t('common.nvi')}
          </Typography>
          <Typography paragraph>
            {customer?.nviInstitution
              ? t('editor.institution.institution_is_nvi_institution')
              : t('editor.institution.institution_is_not_nvi_institution')}
          </Typography>

          <Typography variant="h3" component="h2">
            {t('common.rbo')}
          </Typography>
          <Typography paragraph>
            {customer?.rboInstitution ? t('editor.institution.rbo_funded') : t('editor.institution.not_rbo_funded')}
          </Typography>

          {institutionUsers && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
              {institutionAdmins && (
                <div>
                  <Typography variant="h3" gutterBottom>
                    {institutionAdmins.length > 0
                      ? t('editor.institution.institution_admin_plural')
                      : t('editor.institution.institution_admin_single')}
                  </Typography>
                  {institutionAdmins.length > 0 ? (
                    institutionAdmins.map((admin) => <InstitutionUserLink key={admin.cristinId} user={admin} />)
                  ) : (
                    <Typography>{t('editor.institution.institution_has_no_administrator')}</Typography>
                  )}
                </div>
              )}

              {institutionEditors && (
                <div>
                  <Typography variant="h3" gutterBottom>
                    {institutionEditors.length > 0
                      ? t('editor.institution.institution_editor_plural')
                      : t('editor.institution.institution_editor_single')}
                  </Typography>
                  {institutionEditors.length > 0 ? (
                    institutionEditors.map((editor) => <InstitutionUserLink key={editor.cristinId} user={editor} />)
                  ) : (
                    <Typography>{t('editor.institution.institution_has_no_editor')}</Typography>
                  )}
                </div>
              )}
            </Box>
          )}

          <Typography sx={{ pt: '1rem' }}>
            <Trans t={t} i18nKey="editor.institution.institution_helper_text">
              <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
            </Trans>
          </Typography>
        </>
      )}
    </>
  );
};

interface InstitutionUserItemProps {
  user: InstitutionUser;
}

const InstitutionUserLink = ({ user }: InstitutionUserItemProps) => {
  const fullName = getFullName(user.givenName, user.familyName);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
      <ProfilePicture sx={{ height: '1.5rem' }} personId={user.cristinId ?? ''} fullName={fullName} />
      <Link href={`${UrlPathTemplate.ResearchProfile}?id=${encodeURIComponent(user.cristinId ?? '')}`}>{fullName}</Link>
    </Box>
  );
};
