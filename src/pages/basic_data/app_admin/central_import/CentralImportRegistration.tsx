import { Link as RouterLink, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { getRegistrationLandingPagePath, RegistrationParams } from '../../../../utils/urlPaths';
import { setNotification } from '../../../../redux/notificationSlice';
import { getIdentifierFromId } from '../../../../utils/general-helpers';

export const CentralImportRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const dispatch = useDispatch();

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const activateRedirectButton = () => {
    setIsActive(false);
  };

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
      activateRedirectButton();
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.create_registration'),
          variant: 'error',
        })
      ),
  });
  const [active, setIsActive] = useState(true);

  const registrationIdentifier = importCandidateMutation.data?.identifier ?? '';

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography>{importCandidateQuery.data?.entityDescription?.mainTitle}</Typography>
        <Button variant="outlined" color="primary" onClick={() => importCandidateMutation.mutate()}>
          {t('basic_data.central_import.import')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={active}
          component={RouterLink}
          to={getRegistrationLandingPagePath(getIdentifierFromId(registrationIdentifier))}>
          {t('basic_data.central_import.see_publication')}
        </Button>
      </Box>
    </>
  );
};
