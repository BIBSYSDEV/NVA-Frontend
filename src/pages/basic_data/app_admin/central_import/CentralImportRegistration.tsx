import { useParams } from 'react-router-dom';
import { RegistrationParams } from '../../../../utils/urlPaths';
import { useQuery } from '@tanstack/react-query';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';

export const CentralImportRegistration = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const dispatch = useDispatch();

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const importCandidate = importCandidateQuery.data;

  const createPublication = async () => {
    if (importCandidate) {
      const createPublicationResponse = await createRegistrationFromImportCandidate(importCandidate);
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
