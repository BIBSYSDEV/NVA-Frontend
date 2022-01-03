import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import { InstitutionList } from './InstitutionList';
import { PageSpinner } from '../../components/PageSpinner';
import { useFetch } from '../../utils/hooks/useFetch';
import { CustomerInstitutionsResponse } from '../../types/customerInstitution.types';
import { CustomerInstitutionApiPath } from '../../api/apiPaths';
import { BackgroundDiv } from '../../components/BackgroundDiv';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation('admin');
  const [customerInstitutions, isLoadingCustomerInstitutions] = useFetch<CustomerInstitutionsResponse>({
    url: CustomerInstitutionApiPath.Customer,
    withAuthentication: true,
    errorMessage: t('feedback:error.get_customers'),
  });

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('admin_institutions')}</PageHeader>
      <BackgroundDiv>
        <StyledRightAlignedWrapper>
          <Button component={RouterLink} to={getAdminInstitutionPath('new')} data-testid="add-institution-button">
            {t('add_institution')}
          </Button>
        </StyledRightAlignedWrapper>
        {isLoadingCustomerInstitutions ? (
          <PageSpinner />
        ) : (
          customerInstitutions && (
            <InstitutionList
              institutions={customerInstitutions.customers.sort((a, b) =>
                a.displayName.toLocaleLowerCase() < b.displayName.toLocaleLowerCase() ? -1 : 1
              )}
            />
          )
        )}
      </BackgroundDiv>
    </StyledPageWrapperWithMaxWidth>
  );
};
