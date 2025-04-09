import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ListPagination } from '../../components/ListPagination';
import { RegistrationList } from '../../components/RegistrationList';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationSearchItem } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus, ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { getTitleString } from '../../utils/registration-helpers';

interface MyRegistrationsListProps {
  registrations: RegistrationSearchItem[];
  refetchRegistrations: () => Promise<unknown>;
}

export const MyRegistrationsList = ({ registrations, refetchRegistrations }: MyRegistrationsListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  useEffect(() => setPage(1), [registrations]); // Reset page if user changes focus between Published and Unpublished

  useEffect(() => {
    if (registrations.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [registrations, page, rowsPerPage]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<RegistrationSearchItem>();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDraftRegistration = async () => {
    if (!registrationToDelete) {
      return;
    }
    const identifierToDelete = getIdentifierFromId(registrationToDelete.id);
    setIsDeleting(true);
    const deleteRegistrationResponse = await deleteRegistration(identifierToDelete);
    if (isErrorStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
      setIsDeleting(false);
    } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
      await refetchRegistrations();
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const onClickDeleteRegistration = (registration: RegistrationSearchItem) => {
    setRegistrationToDelete(registration);
    setShowDeleteModal(true);
  };

  return (
    <>
      {registrations.length > 0 ? (
        <ListPagination
          count={registrations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <RegistrationList
            onDeleteDraftRegistration={onClickDeleteRegistration}
            registrations={registrations}
            canEditRegistration
          />
        </ListPagination>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}

      <ConfirmDialog
        open={showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => setShowDeleteModal(false)}
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
