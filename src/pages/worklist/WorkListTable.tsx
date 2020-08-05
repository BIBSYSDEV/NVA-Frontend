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
import { PublicationPreview, PublicationTab } from '../../types/publication.types';
import { useTranslation } from 'react-i18next';
import Label from '../../components/Label';
import { Link as RouterLink } from 'react-router-dom';
import NormalText from '../../components/NormalText';
import { getTranslatedLabelForDisplayedRows } from '../../utils/pagination';

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
  publications: PublicationPreview[];
}

const WorklistTable: FC<WorklistTableProps> = ({ publications }) => {
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
                <Label>{t('publication_name')}</Label>
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
            {publications.map((publication) => (
              <StyledTableRow key={publication.identifier}>
                <StyledCell component="th" scope="row">
                  <NormalText>{publication.mainTitle}</NormalText>
                </StyledCell>
                <StyledCell>
                  <NormalText>{publication.owner}</NormalText>
                </StyledCell>
                <StyledCell>
                  <NormalText>{publication.createdDate}</NormalText>
                </StyledCell>
                <TableCell>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to={`/publication/${publication.identifier}?tab=${PublicationTab.Submission}`}
                    data-testid={`open-publication-${publication.identifier}`}
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
        count={publications.length}
        labelRowsPerPage={t('common:rows_per_page')}
        labelDisplayedRows={({ from, to, count }) => getTranslatedLabelForDisplayedRows(from, to, count)}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
};

export default WorklistTable;
