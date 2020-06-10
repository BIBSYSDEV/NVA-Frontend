import React, { FC, useState, ChangeEvent, MouseEvent } from 'react';

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
import { getTranslatedLabelForDisplayedRows } from '../../../utils/pagination';
import Card from '../../../components/Card';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledNormalTextWithIcon = styled(NormalText)`
  margin-left: 0.5rem;
`;

const StyledLabel = styled(Label)`
  min-width: 12rem;
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

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
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
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <StyledLabel>{t('workLists:publication_name')}</StyledLabel>
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
                <TableCell>
                  <NormalText>{t(`publication:status.${publication.status}`)}</NormalText>
                </TableCell>
                <TableCell>
                  <NormalText>{new Date(publication.createdDate).toLocaleString()}</NormalText>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    component={RouterLink}
                    to={`/publication/${publication.identifier}`}
                    data-testid={`edit-publication-${publication.identifier}`}>
                    <EditIcon />
                    <StyledNormalTextWithIcon>{t('common:edit')}</StyledNormalTextWithIcon>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    disabled
                    // disabled={publication.status === PublicationStatus.DELETED}
                    variant="outlined"
                    data-testid={`delete-publication-${publication.identifier}`}
                    onClick={() => handleOnClick(publication)}>
                    <DeleteIcon />
                    <StyledNormalTextWithIcon>{t('common:delete')}</StyledNormalTextWithIcon>
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
      {openModal && (
        <DeletePublicationModal id={deletePublicationId} title={deletePublicationTitle} setOpenModal={setOpenModal} />
      )}
    </Card>
  );
};

export default PublicationList;
