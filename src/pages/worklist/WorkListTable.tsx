import React, { FC, useState, ChangeEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import {
  TableRow,
  Table,
  TableHead,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  TablePagination,
} from '@material-ui/core';
import { RegistrationPreview, RegistrationTab } from '../../types/registration.types';
import { useTranslation } from 'react-i18next';
import Label from '../../components/Label';
import { Link as RouterLink } from 'react-router-dom';
import NormalText from '../../components/NormalText';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledCell = styled(TableCell)`
  @media (min-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    min-width: 9rem;
  }
`;

interface WorklistTableProps {
  registrations: RegistrationPreview[];
}

const WorklistTable: FC<WorklistTableProps> = ({ registrations }) => {
  const { t } = useTranslation('workLists');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledCell>
                <Label>{t('common:title')}</Label>
              </StyledCell>
              <StyledCell>
                <Label>{t('submitter')}</Label>
              </StyledCell>
              <StyledCell>
                <Label>{t('common:date')}</Label>
              </StyledCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((registration) => (
              <StyledTableRow key={registration.identifier}>
                <StyledCell component="th" scope="row">
                  <NormalText>{registration.mainTitle}</NormalText>
                </StyledCell>
                <StyledCell>
                  <NormalText>{registration.owner}</NormalText>
                </StyledCell>
                <StyledCell>
                  <NormalText>{registration.createdDate}</NormalText>
                </StyledCell>
                <TableCell>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to={`/registration/${registration.identifier}?tab=${RegistrationTab.Submission}`}
                    data-testid={`open-registration-${registration.identifier}`}
                    variant="contained">
                    <NormalText>{t('common:open')}</NormalText>
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { value: -1, label: t('common:all') }]}
        component="div"
        count={registrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default WorklistTable;
