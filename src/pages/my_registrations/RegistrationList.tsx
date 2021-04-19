import React, { ChangeEvent, FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { deleteRegistration } from '../../api/registrationApi';
import ConfirmDialog from '../../components/ConfirmDialog';
import DangerButton from '../../components/DangerButton';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RegistrationPreview, RegistrationStatus } from '../../types/registration.types';
import { getRegistrationLandingPagePath, getRegistrationPath } from '../../utils/urlPaths';

const StyledTableRow = styled(TableRow)`
  background-color: ${(props) => props.theme.palette.box.main};
  :nth-child(odd) {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: bold;
`;

const StyledLabel = styled(StyledTypography)`
  min-width: 12rem;
`;

interface RegistrationListProps {
  registrations: RegistrationPreview[];
  refetchRegistrations: () => void;
}

const RegistrationList: FC<RegistrationListProps> = ({ registrations, refetchRegistrations }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<RegistrationPreview>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteDraftRegistration = async () => {
    if (!registrationToDelete) {
      return;
    }
    setIsDeleting(true);
    const deleteRegistrationResponse = await deleteRegistration(registrationToDelete.identifier);
    if (deleteRegistrationResponse) {
      if (deleteRegistrationResponse.error) {
        dispatch(setNotification(t('feedback:error.delete_registration'), NotificationVariant.Error));
      } else {
        dispatch(setNotification(t('feedback:success.delete_registration'), NotificationVariant.Success));
        refetchRegistrations();
      }
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell data-testid="header-registration-title">
                <StyledLabel>{t('title')}</StyledLabel>
              </TableCell>
              <TableCell data-testid="header-registration-status">
                <StyledTypography>{t('status')}</StyledTypography>
              </TableCell>
              <TableCell data-testid="header-registration-created">
                <StyledTypography>{t('created_date')}</StyledTypography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((registration) => (
              <StyledTableRow key={registration.identifier}>
                <TableCell component="th" scope="row" data-testid={`registration-title-${registration.identifier}`}>
                  <Typography>{registration.mainTitle ?? <i>[{t('common:missing_title')}]</i>}</Typography>
                </TableCell>
                <TableCell data-testid={`registration-status-${registration.identifier}`}>
                  <Typography>{t(`registration:status.${registration.status}`)}</Typography>
                </TableCell>
                <TableCell data-testid={`registration-created-${registration.identifier}`}>
                  <Typography>{new Date(registration.createdDate).toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={getRegistrationLandingPagePath(registration.identifier)}
                    startIcon={<MenuBookIcon />}
                    data-testid={`open-registration-${registration.identifier}`}>
                    {t('show')}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    variant="outlined"
                    component={RouterLink}
                    to={getRegistrationPath(registration.identifier)}
                    startIcon={<EditIcon />}
                    data-testid={`edit-registration-${registration.identifier}`}>
                    {t('edit')}
                  </Button>
                </TableCell>
                <TableCell>
                  {registration.status === RegistrationStatus.DRAFT && (
                    <DangerButton
                      variant="outlined"
                      data-testid={`delete-registration-${registration.identifier}`}
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setRegistrationToDelete(registration);
                        setShowDeleteModal(true);
                      }}>
                      {t('delete')}
                    </DangerButton>
                  )}
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
      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('workLists:delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
        isLoading={isDeleting}
        dataTestId="confirm-delete-dialog">
        <Typography>
          {t('workLists:delete_registration_message', {
            title: registrationToDelete?.mainTitle ?? registrationToDelete?.identifier,
          })}
        </Typography>
      </ConfirmDialog>
    </>
  );
};

export default RegistrationList;
