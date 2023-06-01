import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { RegistrationParams } from '../../../../utils/urlPaths';

export const CentralImportRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const importCandidate = importCandidateQuery.data;

  const createPublication = async () => {
    if (importCandidate) {
      return await createRegistrationFromImportCandidate(importCandidate);
    }
  };

  return (
    <>
      {importCandidate?.entityDescription?.mainTitle}
      <br />
      <Button variant="outlined" color="primary" onClick={createPublication}>
        Import
      </Button>
    </>
  );
};
