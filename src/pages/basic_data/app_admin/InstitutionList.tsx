import EditIcon from '@mui/icons-material/Edit';
import {
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
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { SimpleCustomerInstitution } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { SearchTextField } from '../../search/SearchTextField';

interface InstitutionListProps {
  institutions: SimpleCustomerInstitution[];
}

enum InstitutionStatusFilter {
  ShowAll,
  Active,
  Inactive,
}

export const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation();

  const [customerStatus, setCustomerStatus] = useState<InstitutionStatusFilter>(InstitutionStatusFilter.ShowAll);
  const [searchTerm, setSearchTerm] = useState('');
  const statusFilteredInstitutions =
    customerStatus === InstitutionStatusFilter.Active
      ? institutions.filter((customer) => customer.active)
      : customerStatus === InstitutionStatusFilter.Inactive
        ? institutions.filter((customer) => !customer.active)
        : institutions;
  const filteredInstitutions = searchTerm
    ? statusFilteredInstitutions.filter((customer) =>
        customer.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : statusFilteredInstitutions;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Box
        sx={{ display: 'grid', gridTemplateColumns: '4fr 1fr', columnGap: '0.5rem', width: { lg: '100%', xl: '50%' } }}>
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
            onChange={(event) => setCustomerStatus(event.target.value as InstitutionStatusFilter)}>
            <MenuItem value={InstitutionStatusFilter.ShowAll}>{t('common.show_all')}</MenuItem>
            <MenuItem value={InstitutionStatusFilter.Active}>{t('basic_data.institutions.show_only_active')}</MenuItem>
            <MenuItem value={InstitutionStatusFilter.Inactive}>
              {t('basic_data.institutions.show_only_inactive')}
            </MenuItem>
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
            {filteredInstitutions.map((institution) => (
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
