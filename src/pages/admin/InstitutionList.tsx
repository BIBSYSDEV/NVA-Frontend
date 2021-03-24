import React, { FC } from 'react';
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
import NormalText from '../../components/NormalText';
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
interface InstitutionListProps {
  institutions: CustomerInstitution[];
}

const InstitutionList: FC<InstitutionListProps> = ({ institutions }) => {
  const { t } = useTranslation('common');

  return (
    <TableContainer>
      <StyledTable data-testid="customer-institutions-list">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>{t('name')}</Typography>
            </TableCell>
            <TableCell>
              <Typography>{t('date')}</Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {institutions.map((institution) => (
            <StyledTableRow key={institution.identifier}>
              <TableCell component="th" scope="row">
                <NormalText>{institution.name}</NormalText>
              </TableCell>
              <StyledSmallCell>
                <NormalText>{new Date(institution.createdDate).toLocaleDateString()}</NormalText>
              </StyledSmallCell>
              <TableCell>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<EditIcon />}
                  component={RouterLink}
                  data-testid={`edit-institution-${institution.shortName}`}
                  to={getAdminInstitutionPath(institution.id)}>
                  <NormalText>{t('edit')}</NormalText>
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
