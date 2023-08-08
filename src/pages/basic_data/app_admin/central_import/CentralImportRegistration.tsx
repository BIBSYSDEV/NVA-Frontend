import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { setNotification } from '../../../../redux/notificationSlice';
import { RegistrationParams, getRegistrationLandingPagePath } from '../../../../utils/urlPaths';

export const CentralImportRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const dispatch = useDispatch();

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const importCandidateMutation = useMutation({
    mutationFn: importCandidateQuery.data
      ? () => createRegistrationFromImportCandidate(importCandidateQuery.data)
      : undefined,
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.create_registration'),
          variant: 'success',
        })
      );
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.create_registration'),
          variant: 'error',
        })
      ),
  });

  const registrationIdentifier = importCandidateMutation.data?.identifier ?? '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography>{importCandidateQuery.data?.entityDescription?.mainTitle}</Typography>
      <LoadingButton
        loading={importCandidateMutation.isLoading}
        variant="outlined"
        color="primary"
        onClick={() => importCandidateMutation.mutate()}>
        {t('basic_data.central_import.import')}
      </LoadingButton>
      <Button
        variant="outlined"
        color="primary"
        disabled={!registrationIdentifier}
        component={RouterLink}
        to={getRegistrationLandingPagePath(registrationIdentifier)}>
        {t('basic_data.central_import.see_publication')}
      </Button>
    </Box>
  );
};
