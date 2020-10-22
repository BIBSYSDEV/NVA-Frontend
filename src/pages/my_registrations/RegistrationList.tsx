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
import { RegistrationPreview } from '../../types/registration.types';
import DeleteRegistrationModal from './DeleteRegistrationModal';

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

interface RegistrationListProps {
  registrations: RegistrationPreview[];
}

const RegistrationList: FC<RegistrationListProps> = ({ registrations }) => {
  const { t } = useTranslation('common');
  const [openModal, setOpenModal] = useState(false);
  const [deleteRegistrationId, setDeleteRegistrationId] = useState('');
  const [deleteRegistrationTitle, setDeleteRegistrationTitle] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOnClick = (registration: RegistrationPreview) => {
    setOpenModal(true);
    setDeleteRegistrationId(registration.identifier);
    setDeleteRegistrationTitle(registration.mainTitle);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <StyledLabel variant="h6">{t('title')}</StyledLabel>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('status')}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">{t('created_date')}</Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((registration) => (
              <StyledTableRow key={registration.identifier}>
                <TableCell component="th" scope="row">
                  <Typography>{registration.mainTitle}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{t(`registration:status.${registration.status}`)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{new Date(registration.createdDate).toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={`/registration/${registration.identifier}/public`}
                    data-testid={`open-registration-${registration.identifier}`}>
                    <MenuBookIcon />
                    <StyledNormalTextWithIcon>{t('show')}</StyledNormalTextWithIcon>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={`/registration/${registration.identifier}`}
                    data-testid={`edit-registration-${registration.identifier}`}>
                    <EditIcon />
                    <StyledNormalTextWithIcon>{t('edit')}</StyledNormalTextWithIcon>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="secondary"
                    disabled
                    // disabled={publication.status === PublicationStatus.DELETED}
                    variant="outlined"
                    data-testid={`delete-registration-${registration.identifier}`}
                    onClick={() => handleOnClick(registration)}>
                    <DeleteIcon />
                    <StyledNormalTextWithIcon>{t('delete')}</StyledNormalTextWithIcon>
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { value: -1, label: t('all') }]}
        component="div"
        count={registrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {openModal && (
        <DeleteRegistrationModal
          id={deleteRegistrationId}
          title={deleteRegistrationTitle}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default RegistrationList;
