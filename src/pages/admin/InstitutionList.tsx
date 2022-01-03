import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { getAdminInstitutionPath } from '../../utils/urlPaths';

const StyledTable = styled(Table)`
  width: 100%;
`;

const StyledSmallCell = styled(TableCell)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    min-width: 9rem;
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;
interface InstitutionListProps {
  institutions: CustomerInstitution[];
}

export const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation('common');

  return (
    <TableContainer>
      <StyledTable data-testid="customer-institutions-list">
        <caption>
          <span style={visuallyHidden}>{t('admin:admin_institutions')}</span>
        </caption>
        <TableHead>
          <TableRow>
            <TableCell>
              <StyledTypography>{t('name')}</StyledTypography>
            </TableCell>
            <TableCell>
              <StyledTypography>{t('date')}</StyledTypography>
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
              <StyledSmallCell>
                <Typography>{new Date(institution.createdDate).toLocaleDateString()}</Typography>
              </StyledSmallCell>
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
      </StyledTable>
    </TableContainer>
  );
};
