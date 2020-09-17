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
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { PublicationPreview } from '../../../types/publication.types';
import DeletePublicationModal from '../DeletePublicationModal';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledNormalTextWithIcon = styled(Typography)`
  margin-left: 0.5rem;
`;

const StyledLabel = styled(Typography)`
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
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <StyledLabel variant="h6">{t('workLists:publication_name')}</StyledLabel>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('common:status')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('common:date')}</Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {publications.map((publication) => (
              <StyledTableRow key={publication.identifier}>
                <TableCell component="th" scope="row">
                  <Typography>{publication.mainTitle}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{t(`publication:status.${publication.status}`)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{new Date(publication.createdDate).toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={`/publication/${publication.identifier}/public`}
                    data-testid={`open-publication-${publication.identifier}`}>
                    <MenuBookIcon />
                    <StyledNormalTextWithIcon>{t('common:show')}</StyledNormalTextWithIcon>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
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
