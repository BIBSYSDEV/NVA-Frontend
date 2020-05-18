import React, { FC, useState, ChangeEvent } from 'react';

import styled from 'styled-components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { PublicationPreview, PublicationStatus } from '../../../types/publication.types';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Label from '../../../components/Label';
import NormalText from '../../../components/NormalText';
import { Link as RouterLink } from 'react-router-dom';
import DeletePublicationModal from '../DeletePublicationModal';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledTableCellForStatus = styled(TableCell)`
  width: 10%;
`;
const StyledTableCellForDate = styled(TableCell)`
  width: 15%;
`;

const StyledEditIcon = styled(EditIcon)`
  margin-right: 0.5rem;
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  margin-right: 0.5rem;
`;

interface PublicationListProps {
  publications: PublicationPreview[];
}

const PublicationList: FC<PublicationListProps> = ({ publications }) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [deletePublicationId, setDeletePublicationId] = useState('');
  const [deletePublicationTitle, setDeletePublicationTitle] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnClick = (publication: PublicationPreview) => {
    setOpenModal(true);
    setDeletePublicationId(publication.identifier);
    setDeletePublicationTitle(publication.mainTitle);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Label>{t('workLists:publication_name')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('common:status')}</Label>
              </TableCell>
              <TableCell>
                <Label>{t('common:date')}</Label>
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {publications.map((publication) => (
              <StyledTableRow key={publication.identifier}>
                <TableCell component="th" scope="row">
                  <NormalText>{publication.mainTitle}</NormalText>
                </TableCell>
                <StyledTableCellForStatus>
                  <NormalText>{t(`publication:status.${publication.status}`)}</NormalText>
                </StyledTableCellForStatus>
                <StyledTableCellForDate>
                  <NormalText>{new Date(publication.createdDate).toLocaleString()}</NormalText>
                </StyledTableCellForDate>
                <TableCell>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to={`/publication/${publication.identifier}`}
                    data-testid={`edit-publication-${publication.identifier}`}>
                    <StyledEditIcon />
                    <NormalText>{t('common:edit')}</NormalText>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    disabled={publication.status === PublicationStatus.DELETED}
                    variant="outlined"
                    data-testid={`delete-publication-${publication.identifier}`}
                    onClick={() => handleOnClick(publication)}>
                    <StyledDeleteIcon />
                    {t('common:delete')}
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
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to === -1 ? count : to} ${t('common:of')} ${
            count !== -1 ? count : `${t('common:more_than')} ${to}`
          }`
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {openModal && (
        <DeletePublicationModal id={deletePublicationId} title={deletePublicationTitle} setOpenModal={setOpenModal} />
      )}
    </>
  );
};

export default PublicationList;
