import { CircularProgress, Link, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../api/commonApi';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { Organization } from '../../types/organization.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';

export const EditorInstitution = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [customer, isLoadingCustomer] = useFetch<CustomerInstitution>({
    url: user?.customerId ? user.customerId : '',
    errorMessage: t('feedback.error.get_customer'),
    withAuthentication: true,
  });
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
