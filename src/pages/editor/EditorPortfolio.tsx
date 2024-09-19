import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { RootState } from '../../redux/store';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

export const EditorPortfolio = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const organizationId = user?.topOrgCristinId;

  const params = useRegistrationsQueryParams();

  const registrationQuery = useCustomerRegistrationSearch({
    enabled: !!organizationId,
    params,
  });

  return (
    <>
      <Typography variant="h1">{t('common.result_portfolio')}</Typography>
      <RegistrationSearch registrationQuery={registrationQuery} />
    </>
  );
};
