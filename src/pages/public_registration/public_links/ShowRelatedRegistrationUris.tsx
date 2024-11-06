import { CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { apiRequest } from '../../../api/apiRequest';
import { Registration, RegistrationSearchItem } from '../../../types/registration.types';
import { isSuccessStatus } from '../../../utils/constants';
import { convertToRegistrationSearchItem } from '../../../utils/registration-helpers';
import { ListRegistrationRelations } from './ListRegistrationRelations';

interface ShowRelatedRegistrationUrisProps {
  links?: string[];
  emptyMessage?: string;
  loadingLabel: string;
}

export const ShowRelatedRegistrationUris = ({
  links = [],
  emptyMessage,
  loadingLabel,
}: ShowRelatedRegistrationUrisProps) => {
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [relatedRegistrations, setRelatedRegistrations] = useState<RegistrationSearchItem[]>([]);

  const linksRef = useRef(links); // Avoid triggering fetching of Registrations multiple times

  useEffect(() => {
    const getRelatedRegistrations = async () => {
      setIsLoadingRegistrations(true);
      const relatedRegistrationsPromises = linksRef.current.map(async (id) => {
        const registrationResponse = await apiRequest<Registration>({ url: id });
        if (isSuccessStatus(registrationResponse.status)) {
          return convertToRegistrationSearchItem(registrationResponse.data);
        } else {
          return;
        }
      });

      const registrations = (await Promise.all(relatedRegistrationsPromises)).filter(
        Boolean
      ) as RegistrationSearchItem[];
      console.log(registrations);
      setRelatedRegistrations(registrations);
      setIsLoadingRegistrations(false);
    };

    if (linksRef.current.length > 0) {
      getRelatedRegistrations();
    }
  }, [linksRef]);

  return linksRef.current.length === 0 ? (
    emptyMessage ? (
      <Typography>{emptyMessage}</Typography>
    ) : null
  ) : isLoadingRegistrations ? (
    <CircularProgress aria-label={loadingLabel} />
  ) : (
    <ListRegistrationRelations registrations={relatedRegistrations} />
  );
};
