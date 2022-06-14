import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { PageHeader } from '../../../components/PageHeader';
import { StyledRightAlignedWrapper } from '../../../components/styled/Wrappers';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { InstitutionList } from './InstitutionList';
import { PageSpinner } from '../../../components/PageSpinner';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CustomerList } from '../../../types/customerInstitution.types';
import { CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { sortCustomerInstitutions } from '../../../utils/institutions-helpers';
import { dataTestId } from '../../../utils/dataTestIds';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation('admin');
  const [customerInstitutions, isLoadingCustomerInstitutions] = useFetch<CustomerList>({
    url: CustomerInstitutionApiPath.Customer,
    withAuthentication: true,
    errorMessage: t('feedback:error.get_customers'),
  });

  return (
    <>
      <PageHeader>{t('admin_institutions')}</PageHeader>
      <StyledRightAlignedWrapper>
        <Button
          component={RouterLink}
          to={getAdminInstitutionPath('new')}
          data-testid={dataTestId.basicData.customers.addCustomerButton}>
          {t('add_institution')}
        </Button>
      </StyledRightAlignedWrapper>
      {isLoadingCustomerInstitutions ? (
        <PageSpinner />
      ) : (
        customerInstitutions && (
          <InstitutionList institutions={sortCustomerInstitutions(customerInstitutions.customers)} />
        )
      )}
    </>
  );
};
