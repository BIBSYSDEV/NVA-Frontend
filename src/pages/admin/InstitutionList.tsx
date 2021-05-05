import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { CustomerInstitution } from '../../types/customerInstitution.types';
import { getAdminInstitutionPath } from '../../utils/urlPaths';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

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

const InstitutionList = ({ institutions }: InstitutionListProps) => {
  const { t } = useTranslation('common');

  return (
    <TableContainer>
      <StyledTable data-testid="customer-institutions-list">
        <caption>
          <Typography variant="srOnly">{t('admin:admin_institutions')}</Typography>
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
            <StyledTableRow key={institution.identifier}>
              <TableCell component="th" scope="row">
                <Typography>{institution.name}</Typography>
              </TableCell>
              <StyledSmallCell>
                <Typography>{new Date(institution.createdDate).toLocaleDateString()}</Typography>
              </StyledSmallCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  data-testid={`edit-institution-${institution.shortName}`}
                  to={getAdminInstitutionPath(institution.id)}>
                  <Typography>{t('edit')}</Typography>
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default InstitutionList;
