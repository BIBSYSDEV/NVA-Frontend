import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Card from '../../components/Card';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth, StyledRightAlignedWrapper } from '../../components/styled/Wrappers';
import { getAdminInstitutionPath } from '../../utils/urlPaths';
import InstitutionList from './InstitutionList';
import { PageSpinner } from '../../components/PageSpinner';
import { useFetchCustomerInstitutions } from '../../utils/hooks/useFetchCustomerInstitutions';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation('admin');
  const [customerInstitutions, isLoadingCustomerInstitutions] = useFetchCustomerInstitutions();

  return (
    <StyledPageWrapperWithMaxWidth>
      <Helmet>
        <title>{t('admin_institutions')}</title>
      </Helmet>
      <PageHeader>{t('admin_institutions')}</PageHeader>
      <Card>
        <StyledRightAlignedWrapper>
          <Button
            color="primary"
            component={RouterLink}
            to={getAdminInstitutionPath('new')}
            data-testid="add-institution-button">
            {t('add_institution')}
          </Button>
        </StyledRightAlignedWrapper>
        {isLoadingCustomerInstitutions ? <PageSpinner /> : <InstitutionList institutions={customerInstitutions} />}
      </Card>
    </StyledPageWrapperWithMaxWidth>
  );
};
