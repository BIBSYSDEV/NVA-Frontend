import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
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
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { SimpleCustomerInstitution } from '../../../types/customerInstitution.types';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { dataTestId } from '../../../utils/dataTestIds';
import { alternatingTableRowColor } from '../../../themes/mainTheme';

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
            <TableCell>{t('common.date')}</TableCell>
            <TableCell>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell>
                <Typography>{institution.displayName}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{new Date(institution.createdDate).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  data-testid={dataTestId.basicData.customers.editInstitutionButton(institution.displayName)}
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
