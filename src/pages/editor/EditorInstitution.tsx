import { CircularProgress, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { Organization } from '../../types/organization.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { useFetchResource } from '../../utils/hooks/useFetchResource';

export const EditorInstitution = () => {
  const { t } = useTranslation('editor');
  const user = useSelector((store: RootState) => store.user);
  const [customer, isLoadingCustomer] = useFetch<CustomerInstitution>({
    url: user?.customerId ? user.customerId : '',
    errorMessage: t('feedback:error.get_customer'),
  });
  const [institution, isLoadingInstitution] = useFetchResource<Organization>(
    user?.topOrgCristinId ? user.topOrgCristinId : '',
    t('feedback:error.get_institution')
  );

  return isLoadingCustomer || isLoadingInstitution ? (
    <CircularProgress />
  ) : (
    <>
      <Typography variant="overline">{t('institution.institution_name_norwegian')}</Typography>
      <Typography paragraph>{institution?.name.nb ?? '-'}</Typography>

      <Typography variant="overline">{t('institution.institution_name_english')}</Typography>
      <Typography paragraph>{institution?.name.en ?? '-'}</Typography>

      <Typography variant="overline">{t('institution.institution_short_name')}</Typography>
      <Typography paragraph>{customer?.shortName ?? '-'}</Typography>

      <Typography variant="overline">{t('institution.institution_code')}</Typography>
      <Typography paragraph>{institution?.id.split('/').pop() ?? '-'}</Typography>

      <Typography variant="overline">{t('basicData:institutions.ror')}</Typography>
      <Typography paragraph>
        {customer?.rorId ? (
          <Link href={customer.rorId} target="_blank" rel="noopener noreferrer">
            {customer.rorId}
          </Link>
        ) : (
          '-'
        )}
      </Typography>

      <Typography sx={{ pt: '1rem' }}>
        <Trans t={t} i18nKey="institution.institution_helper_text">
          <Link href="mailto:support@sikt.no" target="_blank" rel="noopener noreferrer" />
        </Trans>
      </Typography>
    </>
  );
};
