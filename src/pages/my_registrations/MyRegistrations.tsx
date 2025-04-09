import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import { useUserRegistrationSearch } from '../../api/hooks/useFetchUserRegistrationSearch';
import { deleteRegistration, fetchRegistrationsByOwner } from '../../api/registrationApi';
import { ResultParam, UserResultParam } from '../../api/searchApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ListSkeleton } from '../../components/ListSkeleton';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus } from '../../types/registration.types';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { MyRegistrationsList } from './MyRegistrationsList';

const statusFilterLabelId = 'status-radio-buttons-group-label';

export const MyRegistrations = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [, setSearchParams] = useSearchParams();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const params = useRegistrationsQueryParams();
  const userRegistrationsQuery = useUserRegistrationSearch(params);

  const registrationsQuery = useQuery({
    queryKey: ['by-owner'],
    queryFn: fetchRegistrationsByOwner,
    meta: { errorMessage: t('feedback.error.search') },
  });

  const nextRegistrations = userRegistrationsQuery.data?.hits ?? [];
  // const registrations = registrationsQuery.data?.publications ?? [];

  const deleteDraftRegistrationMutation = useMutation({
    mutationFn: async () => {
      const draftRegistrations = nextRegistrations.filter(
        (registration) => registration.recordMetadata.status === RegistrationStatus.Draft
      );
      const deletePromises = draftRegistrations.map((registration) => deleteRegistration(registration.identifier));
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
      <Helmet>
        <title>{t('common.result_registrations')}</title>
      </Helmet>
      <div>
        {registrationsQuery.isPending ? (
          <ListSkeleton minWidth={100} maxWidth={100} height={100} />
        ) : (
          <>
            <Typography gutterBottom variant="h1">
              {t('common.result_registrations')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl>
                <FormLabel id={statusFilterLabelId}>{t('common.status')}</FormLabel>
                <RadioGroup
                  aria-labelledby={statusFilterLabelId}
                  row
                  value={params.status}
                  onChange={(_, value) =>
                    setSearchParams((params) => {
                      params.set(UserResultParam.Status, value);
                      params.delete(ResultParam.From);
                      return params;
                    })
                  }>
                  <FormControlLabel
                    value={RegistrationStatus.Draft}
                    control={<Radio />}
                    label={t('registration.status.DRAFT')}
                  />
                  <FormControlLabel
                    value={RegistrationStatus.Published}
                    control={<Radio />}
                    label={t('registration.status.PUBLISHED')}
                  />
                </RadioGroup>
              </FormControl>

              {(!selectedPublished || selectedUnpublished) && (
                <Button
                  sx={{ bgcolor: 'white' }}
                  variant="outlined"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={!params.status?.includes(RegistrationStatus.Draft)}>
                  {t('my_page.registrations.delete_all_draft_registrations')}
                </Button>
              )}
            </Box>
            <MyRegistrationsList registrations={nextRegistrations} refetchRegistrations={registrationsQuery.refetch} />
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
