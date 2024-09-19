import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useCustomerRegistrationSearch } from '../../api/hooks/useFetchCustomerRegistrationSearch';
import { CustomerResultParam } from '../../api/searchApi';
import { RootState } from '../../redux/store';
import { RegistrationStatus } from '../../types/registration.types';
import { RegistrationSearch } from '../search/registration_search/RegistrationSearch';

export const EditorPortfolio = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const organizationId = user?.topOrgCristinId;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const selectedStatuses = queryParams.get(CustomerResultParam.Status) as RegistrationStatus[] | null;

  const registrationQuery = useCustomerRegistrationSearch({
    enabled: !!organizationId,
    params: { query: '', status: selectedStatuses },
  });

  return (
    <>
      <Typography variant="h1">{t('common.result_portfolio')}</Typography>
      <RegistrationSearch registrationQuery={registrationQuery} />
    </>
  );
};
