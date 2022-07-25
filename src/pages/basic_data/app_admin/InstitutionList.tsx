import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { SimpleCustomerInstitution } from '../../../types/customerInstitution.types';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';
import { dataTestId } from '../../../utils/dataTestIds';

interface InstitutionListProps {
  institutions: SimpleCustomerInstitution[];
}

export const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <Table data-testid={dataTestId.basicData.customers.customerList}>
        <caption>
          <span style={visuallyHidden}>{t('basic_data.institutions.admin_institutions')}</span>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight="bold">{t('common.name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">{t('common.date')}</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.id}>
              <TableCell component="th" scope="row">
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
