import { CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../../../api/apiRequest';
import { Registration } from '../../../types/registration.types';
import { isSuccessStatus } from '../../../utils/constants';
import { ListRegistrationRelations } from './ListRegistrationRelations';

interface ShowRelatedRegistrationUrisProps {
  links?: string[];
  emptyMessage: string;
  loadingLabel: string;
}

export const ShowRelatedRegistrationUris = ({
  links = [],
  emptyMessage,
  loadingLabel,
}: ShowRelatedRegistrationUrisProps) => {
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [relatedRegistrations, setRelatedRegistrations] = useState<Registration[]>([]);

  const getRelatedRegistrations = useCallback(async () => {
    setIsLoadingRegistrations(true);
    const relatedRegistrationsPromises = links.map(async (id) => {
      const registrationResponse = await apiRequest<Registration>({ url: id });
      if (isSuccessStatus(registrationResponse.status)) {
        return registrationResponse.data;
      }
    });
    const registrations = (await Promise.all(relatedRegistrationsPromises)).filter(
      (registration) => registration // Remove null/undefined objects
    ) as Registration[];
    setRelatedRegistrations(registrations);
    setIsLoadingRegistrations(false);
  }, [links]);

  useEffect(() => {
    getRelatedRegistrations();
  }, [getRelatedRegistrations]);

  return links.length === 0 ? (
    <Typography>{emptyMessage}</Typography>
  ) : isLoadingRegistrations ? (
    <CircularProgress aria-label={loadingLabel} />
  ) : (
    <ListRegistrationRelations registrations={relatedRegistrations} />
  );
};
