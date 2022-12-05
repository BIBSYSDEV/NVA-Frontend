import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { visuallyHidden } from '@mui/utils';
import { deleteRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationPreview, RegistrationStatus } from '../../types/registration.types';
import { getRegistrationLandingPagePath, getRegistrationWizardPath } from '../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { getRegistrationIdentifier, getTitleString } from '../../utils/registration-helpers';
import { TruncatableTypography } from '../../components/TruncatableTypography';

interface MyRegistrationsListProps {
  registrations: RegistrationPreview[];
  refetchRegistrations: () => void;
}

export const MyRegistrationsList = ({ registrations, refetchRegistrations }: MyRegistrationsListProps) => {
  const { t } = useTranslation();
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
    const identifierToDelete = getRegistrationIdentifier(registrationToDelete.id);
    setIsDeleting(true);
    const deleteRegistrationResponse = await deleteRegistration(identifierToDelete);
    if (isErrorStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
      setIsDeleting(false);
    } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
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
      <TableContainer component={Paper}>
        <Table sx={alternatingTableRowColor}>
          <caption style={visuallyHidden}>{t('common.registrations')}</caption>
          <TableHead>
            <TableRow>
              <TableCell data-testid="header-registration-title" sx={{ minWidth: '12rem' }}>
                {t('common.title')}
              </TableCell>
              <TableCell data-testid="header-registration-status">{t('common.status')}</TableCell>
              <TableCell data-testid="header-registration-created">{t('common.created_date')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrationsOnPage.map((registration) => {
              const identifier = getRegistrationIdentifier(registration.id);
              return (
                <TableRow key={identifier}>
                  <TableCell component="th" scope="row" data-testid={`registration-title-${identifier}`}>
                    <TruncatableTypography>{getTitleString(registration.mainTitle)}</TruncatableTypography>
                  </TableCell>
                  <TableCell data-testid={`registration-status-${identifier}`}>
                    <Typography>{t(`registration.status.${registration.status}`)}</Typography>
                  </TableCell>
                  <TableCell data-testid={`registration-created-${identifier}`}>
                    <Typography>{new Date(registration.createdDate).toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                      <Button
                        variant="outlined"
                        component={RouterLink}
                        to={getRegistrationLandingPagePath(identifier)}
                        startIcon={<MenuBookIcon />}
                        data-testid={`open-registration-${identifier}`}>
                        {t('common.show')}
                      </Button>
                      <Button
                        variant="outlined"
                        component={RouterLink}
                        to={getRegistrationWizardPath(identifier)}
                        startIcon={<EditIcon />}
                        data-testid={`edit-registration-${identifier}`}>
                        {t('common.edit')}
                      </Button>
                      {registration.status === RegistrationStatus.Draft && (
                        <Button
                          color="error"
                          variant="outlined"
                          data-testid={`delete-registration-${identifier}`}
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setRegistrationToDelete(registration);
                            setShowDeleteModal(true);
                          }}>
                          {t('common.delete')}
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, { value: registrations.length, label: t('common.all') }]}
        component="div"
        count={registrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => {
          setShowDeleteModal(false);
        }}
        isLoading={isDeleting}
        dialogDataTestId="confirm-delete-dialog">
        <Typography>
          {t('my_page.registrations.delete_registration_message', {
            title: getTitleString(registrationToDelete?.mainTitle),
          })}
        </Typography>
      </ConfirmDialog>
    </>
  );
};
