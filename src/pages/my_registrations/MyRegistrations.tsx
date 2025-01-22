import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { deleteRegistration, fetchRegistrationsByOwner } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ListSkeleton } from '../../components/ListSkeleton';
import { DocumentHeadTitle } from '../../context/DocumentHeadTitle';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus } from '../../types/registration.types';
import { MyRegistrationsList } from './MyRegistrationsList';

interface MyRegistrationsProps {
  selectedPublished: boolean;
  selectedUnpublished: boolean;
}

export const MyRegistrations = ({ selectedUnpublished, selectedPublished }: MyRegistrationsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const registrationsQuery = useQuery({
    queryKey: ['by-owner'],
    queryFn: fetchRegistrationsByOwner,
    meta: { errorMessage: t('feedback.error.search') },
  });

  const registrations = registrationsQuery.data?.publications ?? [];
  const draftRegistrations = registrations.filter(({ status }) => status === RegistrationStatus.Draft);

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

  const deleteDraftRegistrationMutation = useMutation({
    mutationFn: async () => {
      const deletePromises = draftRegistrations.map(
        async (registration) => await deleteRegistration(registration.identifier)
      );

      await Promise.all(deletePromises);
      await registrationsQuery.refetch();
    },
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.delete_draft_registrations'),
          variant: 'success',
        })
      );
      setShowDeleteModal(false);
    },
    onError: () => {
      dispatch(
        setNotification({
          message: t('feedback.error.delete_draft_registrations'),
          variant: 'error',
        })
      );
    },
  });

  return (
    <>
      <DocumentHeadTitle>{t('common.result_registrations')}</DocumentHeadTitle>
      <div>
        {registrationsQuery.isPending ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography gutterBottom variant="h2">
                {t('common.result_registrations')}
              </Typography>
              {(!selectedPublished || selectedUnpublished) && (
                <Button
                  sx={{ bgcolor: 'white' }}
                  variant="outlined"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={draftRegistrations.length === 0}>
                  {t('my_page.registrations.delete_all_draft_registrations')}
                </Button>
              )}
            </Box>
            <MyRegistrationsList
              registrations={filteredRegistrations}
              refetchRegistrations={registrationsQuery.refetch}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!showDeleteModal}
        title={t('my_page.registrations.delete_registration')}
        onAccept={() => deleteDraftRegistrationMutation.mutate()}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleteDraftRegistrationMutation.isPending}>
        <Typography>{t('my_page.registrations.delete_all_draft_registrations_message')}</Typography>
      </ConfirmDialog>
    </>
  );
};
