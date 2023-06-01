import { useParams } from 'react-router-dom';
import { RegistrationParams } from '../../../../utils/urlPaths';
import { useQuery } from '@tanstack/react-query';
import { fetchImportCandidate } from '../../../../api/registrationApi';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react-hooks/rules-of-hooks

export const CentralImportRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const importCandidate = importCandidateQuery.data;
  return <>app</>;
};
