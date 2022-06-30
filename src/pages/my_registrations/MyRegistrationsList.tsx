import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { visuallyHidden } from '@mui/utils';
import { deleteRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationPreview, RegistrationStatus } from '../../types/registration.types';
import { getRegistrationLandingPagePath, getRegistrationPath } from '../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';

interface MyRegistrationsListProps {
  registrations: RegistrationPreview[];
  refetchRegistrations: () => void;
}

export const MyRegistrationsList = ({ registrations, refetchRegistrations }: MyRegistrationsListProps) => {
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
    if (isErrorStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback:error.delete_registration'), variant: 'error' }));
      setIsDeleting(false);
    } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback:success.delete_registration'), variant: 'success' }));
      refetchRegistrations();
    }
  };

  useEffect(() => {
    if (registrations.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [registrations, page, rowsPerPage]);

  const registrationsOnPage = registrations.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
      <TableContainer>
        <Table sx={alternatingTableRowColor}>
          <caption>
            <span style={visuallyHidden}>{t('common:registrations')}</span>
          </caption>
          <TableHead>
            <TableRow>
              <TableCell data-testid="header-registration-title">
                <Typography sx={{ fontWeight: 'bold', minWidth: '12rem' }}>{t('title')}</Typography>
              </TableCell>
              <TableCell data-testid="header-registration-status">
                <Typography fontWeight="bold">{t('status')}</Typography>
              </TableCell>
              <TableCell data-testid="header-registration-created">
                <Typography fontWeight="bold">{t('created_date')}</Typography>
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {registrationsOnPage.map((registration) => (
              <TableRow key={registration.identifier}>
                <TableCell component="th" scope="row" data-testid={`registration-title-${registration.identifier}`}>
                  <Typography>{registration.mainTitle || <i>[{t('common:missing_title')}]</i>}</Typography>
                </TableCell>
                <TableCell data-testid={`registration-status-${registration.identifier}`}>
                  <Typography>{t<string>(`registration:status.${registration.status}`)}</Typography>
                </TableCell>
                <TableCell data-testid={`registration-created-${registration.identifier}`}>
                  <Typography>{new Date(registration.createdDate).toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Button
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
                    variant="outlined"
                    component={RouterLink}
                    to={getRegistrationPath(registration.identifier)}
                    startIcon={<EditIcon />}
                    data-testid={`edit-registration-${registration.identifier}`}>
                    {t('edit')}
                  </Button>
                </TableCell>
                <TableCell>
                  {registration.status === RegistrationStatus.Draft && (
                    <Button
                      color="error"
                      variant="outlined"
                      data-testid={`delete-registration-${registration.identifier}`}
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        setRegistrationToDelete(registration);
                        setShowDeleteModal(true);
                      }}>
                      {t('delete')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
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
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('myPage:registrations.delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
        isLoading={isDeleting}
        dataTestId="confirm-delete-dialog">
        <Typography>
          {t('myPage:registrations.delete_registration_message', {
            title: registrationToDelete?.mainTitle ?? registrationToDelete?.identifier,
          })}
        </Typography>
      </ConfirmDialog>
    </>
  );
};
