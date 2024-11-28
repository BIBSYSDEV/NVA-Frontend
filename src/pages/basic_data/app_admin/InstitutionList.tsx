import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { SimpleCustomerInstitution } from '../../../types/customerInstitution.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';

interface InstitutionListProps {
  institutions: SimpleCustomerInstitution[];
}

export const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table data-testid={dataTestId.basicData.customers.customerList} sx={alternatingTableRowColor}>
        <caption style={visuallyHidden}>{t('basic_data.institutions.admin_institutions')}</caption>
        <TableHead>
          <TableRow>
            <TableCell>{t('common.name')}</TableCell>
            <TableCell>{t('basic_data.institutions.doi_prefix')}</TableCell>
            <TableCell>{t('common.status')}</TableCell>
            <TableCell>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
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
  );
};
