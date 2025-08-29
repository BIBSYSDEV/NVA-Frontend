import { Paper, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { fetchImportCandidate, updateImportCandidateStatus, updateRegistration } from '../../api/registrationApi';
import NotFound from '../../pages/errorpages/NotFound';
import { setNotification } from '../../redux/notificationSlice';
import { BasicDataLocationState, RegistrationFormLocationState } from '../../types/locationState.types';
import { Registration } from '../../types/registration.types';
import { updateRegistrationQueryData } from '../../utils/registration-helpers';
import { getImportCandidatePath, getRegistrationWizardPath } from '../../utils/urlPaths';
import { PageSpinner } from '../PageSpinner';
import { StyledPageContent } from '../styled/Wrappers';
import { MergeResultsWizard } from './MergeResultsWizard';

interface MergeImportCandidateParams extends Record<string, string | undefined> {
  candidateIdentifier: string;
  registrationIdentifier: string;
}

export const MergeImportCandidate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const locationState = location.state as BasicDataLocationState;
  const { candidateIdentifier, registrationIdentifier } = useParams<MergeImportCandidateParams>();

  const registrationQuery = useFetchRegistration(registrationIdentifier);

  const importCandidateQuery = useQuery({
    enabled: !!candidateIdentifier,
    queryKey: ['importCandidate', candidateIdentifier],
    queryFn: () => fetchImportCandidate(candidateIdentifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' })),
  });

  const importCandidateMutation = useMutation({
    mutationFn: () =>
      updateImportCandidateStatus(candidateIdentifier ?? '', {
        candidateStatus: 'IMPORTED',
        nvaPublicationId: registrationQuery.data?.id ?? '',
      }),
    onError: () => dispatch(setNotification({ message: t('feedback.error.update_import_status'), variant: 'error' })),
  });

  if (registrationQuery.isPending || importCandidateQuery.isPending) {
    return <PageSpinner />;
  }

  if (importCandidateQuery.data?.importStatus.candidateStatus === 'IMPORTED') {
    return <Navigate to={{ pathname: getImportCandidatePath(candidateIdentifier ?? '') }} state={locationState} />;
  }

  if (!importCandidateQuery.data || !registrationQuery.data) {
    return <NotFound />;
  }

  return (
    <StyledPageContent sx={{ mx: 'auto' }}>
      <Paper sx={{ mb: '1rem', p: '1rem' }}>
        <Typography variant="h1" gutterBottom>
          {t('basic_data.central_import.merge_candidate.merge')}
        </Typography>
        <Typography>{t('basic_data.central_import.merge_candidate.merge_details_1')}</Typography>
        <Typography>{t('basic_data.central_import.merge_candidate.merge_details_2')}</Typography>
      </Paper>

      <MergeResultsWizard
        sourceResult={importCandidateQuery.data}
        targetResult={registrationQuery.data}
        onSave={async (data) => {
          const updateRegistrationResponse = await registrationMutation.mutateAsync(data);
          if (updateRegistrationResponse.data) {
            updateRegistrationQueryData(queryClient, updateRegistrationResponse.data);
          }
          await importCandidateMutation.mutateAsync();
          dispatch(setNotification({ message: t('feedback.success.merge_import_candidate'), variant: 'success' }));
          navigate(getRegistrationWizardPath(registrationQuery.data.identifier), {
            state: {
              ...locationState,
              previousPath: getImportCandidatePath(importCandidateQuery.data.identifier),
            } satisfies RegistrationFormLocationState,
          });
        }}
      />
    </StyledPageContent>
  );
};
