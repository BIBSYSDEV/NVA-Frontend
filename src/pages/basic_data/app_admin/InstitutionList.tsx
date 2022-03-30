import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { CustomerInstitution } from '../../../types/customerInstitution.types';
import { getAdminInstitutionPath } from '../../../utils/urlPaths';

interface InstitutionListProps {
  institutions: CustomerInstitution[];
}

export const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation('common');

  return (
    <TableContainer>
      <Table data-testid="customer-institutions-list">
        <caption>
          <span style={visuallyHidden}>{t('admin:admin_institutions')}</span>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight="bold">{t('name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">{t('date')}</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
            <TableRow key={institution.identifier}>
              <TableCell component="th" scope="row">
                <Typography>{institution.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{new Date(institution.createdDate).toLocaleDateString()}</Typography>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  data-testid={`edit-institution-${institution.shortName}`}
                  to={getAdminInstitutionPath(institution.id)}>
                  <Typography>{t('edit')}</Typography>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
