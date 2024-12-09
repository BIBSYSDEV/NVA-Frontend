import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { SimpleCustomerInstitution } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { SearchTextField } from '../../search/SearchTextField';

interface CustomerInstitutionListProps {
  customerInstitutions: SimpleCustomerInstitution[];
}

enum CustomerStatusFilter {
  ShowAll,
  Active,
  Inactive,
}

export const CustomerInstitutionList = ({ customerInstitutions }: CustomerInstitutionListProps) => {
  const { t } = useTranslation();

  const [customerStatus, setCustomerStatus] = useState(CustomerStatusFilter.ShowAll);
  const [searchTerm, setSearchTerm] = useState('');
  const statusFilteredCustomers =
    customerStatus === CustomerStatusFilter.Active
      ? customerInstitutions.filter((customer) => customer.active)
      : customerStatus === CustomerStatusFilter.Inactive
        ? customerInstitutions.filter((customer) => !customer.active)
        : customerInstitutions;
  const filteredCustomers = searchTerm
    ? statusFilteredCustomers.filter((customer) =>
        customer.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : statusFilteredCustomers;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '3fr 2fr', sm: '4fr 1fr' },
          columnGap: '0.5rem',
          width: { lg: '100%', xl: '50%' },
        }}>
        <SearchTextField
          data-testid={dataTestId.basicData.customers.customerNameSearchField}
          placeholder={t('basic_data.institutions.search_for_name')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id={'customer-active-select'}>{t('tasks.display_options')}</InputLabel>
          <Select
            data-testid={dataTestId.basicData.customers.customerStatusSelect}
            size="small"
            value={customerStatus}
            labelId={'customer-active-select'}
            label={t('tasks.display_options')}
            onChange={(event) => setCustomerStatus(event.target.value as CustomerStatusFilter)}>
            <MenuItem value={CustomerStatusFilter.ShowAll}>{t('common.show_all')}</MenuItem>
            <MenuItem value={CustomerStatusFilter.Active}>{t('basic_data.institutions.show_only_active')}</MenuItem>
            <MenuItem value={CustomerStatusFilter.Inactive}>{t('basic_data.institutions.show_only_inactive')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table data-testid={dataTestId.basicData.customers.customerList} sx={alternatingTableRowColor}>
          <caption style={visuallyHidden}>{t('basic_data.institutions.admin_institutions')}</caption>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { md: '40%', lg: '50%' } }}>{t('common.name')}</TableCell>
              <TableCell sx={{ width: '10%' }}>{t('basic_data.institutions.doi_prefix')}</TableCell>
              <TableCell sx={{ width: '10%' }}>{t('common.status')}</TableCell>
              <TableCell sx={{ width: '10%' }}>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((institution) => (
              <TableRow key={institution.id}>
                <TableCell>
                  <Typography>{institution.displayName ?? institution.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{institution.doiPrefix}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {institution.active ? t('basic_data.institutions.active') : t('basic_data.institutions.not_active')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={RouterLink}
                    data-testid={dataTestId.basicData.customers.editInstitutionButton(institution.id)}
                    to={getAdminInstitutionPath(institution.id)}>
                    <Typography>{t('common.edit')}</Typography>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
