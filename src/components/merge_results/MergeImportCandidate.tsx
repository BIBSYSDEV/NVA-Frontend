import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { fetchImportCandidate } from '../../api/registrationApi';
import { PageSpinner } from '../PageSpinner';
import { MergeResultsWizard } from './MergeResultsWizard';

interface MergeImportCandidateParams extends Record<string, string | undefined> {
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
    return null; // TODO: Handle better?
  }

  return <MergeResultsWizard sourceResult={importCandidateQuery.data} targetResult={registrationQuery.data} />;
};
