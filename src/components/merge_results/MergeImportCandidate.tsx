import { Paper, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { useUpdateRegistration } from '../../api/hooks/useUpdateRegistration';
import { fetchImportCandidate, updateImportCandidateStatus } from '../../api/registrationApi';
import NotFound from '../../pages/errorpages/NotFound';
import { setNotification } from '../../redux/notificationSlice';
import { BasicDataLocationState, RegistrationFormLocationState } from '../../types/locationState.types';
import { getImportCandidatePath, getRegistrationWizardPath } from '../../utils/urlPaths';
import { HeadTitle } from '../HeadTitle';
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
  const locationState = location.state as BasicDataLocationState;
  const { candidateIdentifier, registrationIdentifier } = useParams<MergeImportCandidateParams>();

  const registrationQuery = useFetchRegistration(registrationIdentifier);

  const importCandidateQuery = useQuery({
    enabled: !!candidateIdentifier,
    queryKey: ['importCandidate', candidateIdentifier],
    queryFn: () => fetchImportCandidate(candidateIdentifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });

  const registrationMutation = useUpdateRegistration({ ignoreSuccessMessage: true });

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
      <HeadTitle>{t('merge_import_candidate')}</HeadTitle>
      <Paper sx={{ mb: '1rem', p: '1rem' }}>
        <Typography variant="h1" gutterBottom>
          {t('merge_import_candidate')}
        </Typography>
        <Typography>{t('basic_data.central_import.merge_candidate.merge_details_1')}</Typography>
        <Typography>{t('basic_data.central_import.merge_candidate.merge_details_2')}</Typography>
      </Paper>

      <MergeResultsWizard
        sourceResult={importCandidateQuery.data}
        targetResult={registrationQuery.data}
        onSave={async (data) => {
          await registrationMutation.mutateAsync(data);
          await importCandidateMutation.mutateAsync();
          dispatch(setNotification({ message: t('feedback.success.merge_import_candidate'), variant: 'success' }));
          navigate(getRegistrationWizardPath(registrationQuery.data.identifier), {
            state: {
              ...locationState,
              previousPath: getImportCandidatePath(importCandidateQuery.data.identifier),
            } satisfies RegistrationFormLocationState,
          });
        }}
        onCancel={() => {
          if (locationState?.previousPath) {
            navigate(-1);
          } else {
            navigate(getImportCandidatePath(importCandidateQuery.data.identifier));
          }
        }}
      />
    </StyledPageContent>
  );
};
