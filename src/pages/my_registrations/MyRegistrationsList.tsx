import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { TablePagination, Typography } from '@mui/material';
import { Registration, RegistrationPreview, emptyRegistration } from '../../types/registration.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { RegistrationList } from '../../components/RegistrationList';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { getTitleString } from '../../utils/registration-helpers';
import { deleteRegistration } from '../../api/registrationApi';
import { setNotification } from '../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';

interface MyRegistrationsListProps {
  registrations: RegistrationPreview[];
  refetchRegistrations: () => void;
}

export const MyRegistrationsList = ({ registrations, refetchRegistrations }: MyRegistrationsListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => setPage(0), [registrations]); // Reset page if user changes focus between Published and Unpublished

  useEffect(() => {
    if (registrations.some(({ mainTitle }) => stringIncludesMathJax(mainTitle))) {
      typesetMathJax();
    }
  }, [registrations, page, rowsPerPage]);

  const registrationsOnPage = registrations.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const registrationsCopy = registrationsOnPage.map((registrationPreview) => {
    const { identifier, id, contributors, mainTitle, publicationInstance, status } = registrationPreview;
    return {
      ...emptyRegistration,
      identifier,
      id,
      status,
      entityDescription: {
        mainTitle,
        contributors,
        reference: { publicationInstance: { type: publicationInstance?.type ?? '' } },
      },
    } as Registration;
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration>();
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
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
      setIsDeleting(false);
      refetchRegistrations();
      setShowDeleteModal(false);
    }
  };

  const onClickDeleteRegistration = (registration: Registration) => {
    setRegistrationToDelete(registration);
    setShowDeleteModal(true);
  };

  return (
    <>
      {registrationsCopy.length > 0 ? (
        <>
          <RegistrationList
            onDeleteDraftRegistration={onClickDeleteRegistration}
            registrations={registrationsCopy}
            canEditRegistration={true}
            refetchRegistrations={refetchRegistrations}
          />
          <TablePagination
            rowsPerPageOptions={[10, 25, { value: registrations.length, label: t('common.all') }]}
            component="div"
            count={registrations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}

      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={deleteDraftRegistration}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        dialogDataTestId="confirm-delete-dialog">
        <Typography>
          {t('my_page.registrations.delete_registration_message', {
            title: getTitleString(registrationToDelete?.entityDescription?.mainTitle),
          })}
        </Typography>
      </ConfirmDialog>
    </>
  );
};
