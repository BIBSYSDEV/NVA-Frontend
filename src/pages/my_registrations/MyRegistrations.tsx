import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteRegistration, fetchRegistrationsByOwner } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ListSkeleton } from '../../components/ListSkeleton';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { MyRegistrationsList } from './MyRegistrationsList';

interface MyRegistrationsProps {
  selectedPublished: boolean;
  selectedUnpublished: boolean;
}

export const MyRegistrations = ({ selectedUnpublished, selectedPublished }: MyRegistrationsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const registrationsQuery = useQuery({
    queryKey: ['by-owner'],
    queryFn: fetchRegistrationsByOwner,
    meta: { errorMessage: t('feedback.error.search') },
  });

  const registrations = registrationsQuery.data?.publications ?? [];

  const filteredRegistrations = registrations
    .filter(
      ({ status }) =>
        (status === RegistrationStatus.Draft && selectedUnpublished) ||
        ((status === RegistrationStatus.Published || status === RegistrationStatus.PublishedMetadata) &&
          selectedPublished) ||
        ((status === RegistrationStatus.Draft ||
          status === RegistrationStatus.Published ||
          status === RegistrationStatus.PublishedMetadata) &&
          !selectedPublished &&
          !selectedUnpublished)
    )
    .sort((a, b) => {
      if (a.status === RegistrationStatus.Draft && b.status !== RegistrationStatus.Draft) {
        return -1;
      } else if (a.status !== RegistrationStatus.Draft && b.status === RegistrationStatus.Draft) {
        return 1;
      }
      return 0;
    });

  const deleteAllDraftRegistrations = async () => {
    const draftRegistrations = registrations.filter(({ status }) => status === RegistrationStatus.Draft);

    setIsDeleting(true);

    const deletePromises = draftRegistrations.map(async (registration) => {
      const identifierToDelete = getIdentifierFromId(registration.id);
      const deleteRegistrationResponse = await deleteRegistration(identifierToDelete);

      if (isErrorStatus(deleteRegistrationResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
      } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
        registrationsQuery.refetch();
      }
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const deleteAllOnClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>{t('common.result_registrations')}</title>
      </Helmet>
      <div>
        {registrationsQuery.isLoading ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography gutterBottom variant="h2">
                {t('common.result_registrations')}
              </Typography>
              <Button variant="contained" onClick={deleteAllOnClick}>
                {t('my_page.registrations.delete_all_draft_registrations')}
              </Button>
            </Box>
            <MyRegistrationsList
              registrations={filteredRegistrations.length > 0 ? filteredRegistrations : []}
              refetchRegistrations={registrationsQuery.refetch}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={deleteAllDraftRegistrations}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        dialogDataTestId="confirm-delete-dialog">
        <Typography>{t('my_page.registrations.delete_all_draft_registrations_message')}</Typography>
      </ConfirmDialog>
    </>
  );
};
