import { Box, CircularProgress, Grid, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../api/commonApi';
import { fetchUsers } from '../../api/roleApi';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { Organization } from '../../types/organization.types';
import { InstitutionUser, RoleName } from '../../types/user.types';
import { getInitials } from '../../utils/general-helpers';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { getFullName } from '../../utils/user-helpers';
import { StyledBaseContributorIndicator } from '../registration/contributors_tab/ContributorIndicator';

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
      <Typography variant="h2" gutterBottom>
        {t('editor.institution.institution_profile')}
      </Typography>
      {isLoadingCustomer || isLoadingInstitution ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" component="h2">
                {t('editor.institution.institution_name_norwegian')}
              </Typography>
              <Typography>{institution?.labels.nb ?? '-'}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h3" component="h2">
                {t('editor.institution.institution_name_english')}
              </Typography>
              <Typography>{institution?.labels.en ?? '-'}</Typography>
            </Grid>

            <Grid container item xs={8} md={4}>
              <Grid item xs={6}>
                <Typography variant="h3" component="h2">
                  {t('editor.institution.institution_short_name')}
                </Typography>
                <Typography>{organizationQuery.data?.acronym ?? '-'}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h3" component="h2">
                  {t('editor.institution.institution_code')}
                </Typography>
                <Typography>{institution?.id.split('/').pop() ?? '-'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" component="h2">
                {t('basic_data.institutions.sector')}
              </Typography>
              <Typography>
                {customer?.sector ? t(`basic_data.institutions.sector_values.${customer.sector}`) : '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h3" component="h2">
                {t('editor.institution.unique_feide_id')}
              </Typography>
              <Typography>{customer?.feideOrganizationDomain ?? '-'}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h3" component="h2">
                {t('basic_data.institutions.ror')}
              </Typography>
              <Typography>
                {customer?.rorId ? (
                  <Link href={customer.rorId} target="_blank" rel="noopener noreferrer">
                    {customer.rorId}
                  </Link>
                ) : (
                  '-'
                )}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item xs={12} md={12} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h2">
                {t('common.nvi')}
              </Typography>
              <Typography>
                {customer?.nviInstitution
                  ? t('editor.institution.institution_is_nvi_institution')
                  : t('editor.institution.institution_is_not_nvi_institution')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h3" component="h2">
                {t('common.rbo')}
              </Typography>
              <Typography>
                {customer?.rboInstitution ? t('editor.institution.rbo_funded') : t('editor.institution.not_rbo_funded')}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h3" component="h2">
                {t('editor.institution.institution_support')}
              </Typography>
              <Link href={customer?.serviceCenterUri} target="_blank" rel="noopener noreferrer">
                {customer?.serviceCenterUri}
              </Link>
            </Grid>

            {institutionUsers && (
              <Grid container item xs={12} md={8}>
                {institutionAdmins && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h3" gutterBottom>
                      {institutionAdmins.length > 0 &&
                        t('editor.institution.institution_admin', { count: institutionAdmins.length })}
                    </Typography>
                    {institutionAdmins.length > 0 ? (
                      institutionAdmins.map((admin) => <InstitutionUserLink key={admin.cristinId} user={admin} />)
                    ) : (
                      <Typography>{t('editor.institution.institution_has_no_administrator')}</Typography>
                    )}
                  </Grid>
                )}

                {institutionEditors && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h3" gutterBottom>
                      {institutionEditors.length > 0 &&
                        t('editor.institution.institution_editor', { count: institutionEditors.length })}
                    </Typography>
                    {institutionEditors.length > 0 ? (
                      institutionEditors.map((editor) => <InstitutionUserLink key={editor.cristinId} user={editor} />)
                    ) : (
                      <Typography>{t('editor.institution.institution_has_no_editor')}</Typography>
                    )}
                  </Grid>
                )}
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography sx={{ pt: '1rem' }}>
                <Trans t={t} i18nKey="editor.institution.institution_helper_text">
                  <Link href="mailto:kontakt@sikt.no" target="_blank" rel="noopener noreferrer" />
                </Trans>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
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
      <StyledBaseContributorIndicator
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}>
        {getInitials(fullName)}
      </StyledBaseContributorIndicator>
      <Link href={`${UrlPathTemplate.ResearchProfile}?id=${encodeURIComponent(user.cristinId ?? '')}`}>{fullName}</Link>
    </Box>
  );
};
