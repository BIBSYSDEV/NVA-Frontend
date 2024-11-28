import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomerInstitutionApiPath } from '../../../api/apiPaths';
import { PageHeader } from '../../../components/PageHeader';
import { PageSpinner } from '../../../components/PageSpinner';
import { CustomerList } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useFetch } from '../../../utils/hooks/useFetch';
import { sortCustomerInstitutions } from '../../../utils/institutions-helpers';
import { SearchTextField } from '../../search/SearchTextField';
import { InstitutionList } from './InstitutionList';

export const AdminCustomerInstitutions = () => {
  const { t } = useTranslation();
  const [customerInstitutions, isLoadingCustomerInstitutions] = useFetch<CustomerList>({
    url: CustomerInstitutionApiPath.Customer,
    withAuthentication: true,
    errorMessage: t('feedback.error.get_customers'),
  });

  const [customerStatus, setCustomerStatus] = useState('');
  const customers = customerInstitutions?.customers ?? [];

  console.log(customers);

  return (
    <>
      <PageHeader id="admin-institutions-label">{t('basic_data.institutions.admin_institutions')}</PageHeader>
      {isLoadingCustomerInstitutions ? (
        <PageSpinner aria-labelledby="admin-institutions-label" />
      ) : (
        customerInstitutions && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '4fr 1fr', columnGap: '0.5rem', width: '50%' }}>
              <SearchTextField />
              <FormControl fullWidth>
                <InputLabel id={'customer-active-select'}>{t('tasks.display_options')}</InputLabel>
                <Select
                  data-testid={dataTestId.tasksPage.unreadSearchSelect}
                  size="small"
                  value={'show-all'}
                  labelId={'customer-active-select'}
                  label={t('tasks.display_options')}>
                  <MenuItem value={'show-all'}>{t('common.show_all')}</MenuItem>
                  <MenuItem value={'active'}>Kun aktive</MenuItem>
                  <MenuItem value={'inactive'}>Kun inaktive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <InstitutionList institutions={sortCustomerInstitutions(customers)} />
          </Box>
        )
      )}
    </>
  );
};
