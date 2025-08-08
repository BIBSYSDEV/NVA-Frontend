import { Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { fetchImportCandidate } from '../../api/registrationApi';
import { PageSpinner } from '../PageSpinner';
import { StyledPageContent } from '../styled/Wrappers';
import { MergeResultsWizard } from './MergeResultsWizard';
import { MergeResultsWizardContextContextProvider } from './MergeResultsWizardContext';

export interface MergeImportCandidateParams extends Record<string, string | undefined> {
  candidateIdentifier: string;
  registrationIdentifier: string;
}

export const MergeImportCandidate = () => {
  const { t } = useTranslation();
  const { candidateIdentifier, registrationIdentifier } = useParams<MergeImportCandidateParams>();

  const registrationQuery = useFetchRegistration(registrationIdentifier);

  const importCandidateQuery = useQuery({
    enabled: !!candidateIdentifier,
    queryKey: ['importCandidate', candidateIdentifier],
    queryFn: () => fetchImportCandidate(candidateIdentifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });

  if (registrationQuery.isPending || importCandidateQuery.isPending) {
    return <PageSpinner />;
  }

  if (!importCandidateQuery.data || !registrationQuery.data) {
    return null;
  }

  return (
    <MergeResultsWizardContextContextProvider
      value={{ sourceResult: importCandidateQuery.data, targetResult: registrationQuery.data }}>
      <StyledPageContent sx={{ mx: 'auto' }}>
        <Paper sx={{ mb: '1rem', p: '1rem' }}>
          <Typography variant="h1" gutterBottom>
            {t('basic_data.central_import.merge_candidate.merge')}
          </Typography>
          <Typography>{t('basic_data.central_import.merge_candidate.merge_details_1')}</Typography>
          <Typography>{t('basic_data.central_import.merge_candidate.merge_details_2')}</Typography>
        </Paper>
        <MergeResultsWizard />
      </StyledPageContent>
    </MergeResultsWizardContextContextProvider>
  );
};
