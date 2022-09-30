import { CircularProgress, Link, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../api/apiRequest';
import { RegistrationList } from '../../components/RegistrationList';
import { Registration } from '../../types/registration.types';
import { API_URL, isSuccessStatus } from '../../utils/constants';

interface PublicRelatedResourcesContentProps {
  related: string[];
}

export const PublicRelatedResourcesContent = ({ related = [] }: PublicRelatedResourcesContentProps) => {
  const internalResources = useMemo(() => related.filter((uri) => uri.includes(API_URL)), [related]);
  const externalResources = related.filter((uri) => !uri.includes(API_URL));

  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [relatedRegistrations, setRelatedRegistrations] = useState<Registration[]>([]);

  const getRelatedRegistrations = useCallback(async () => {
    setIsLoadingRegistrations(true);
    const relatedRegistrationsPromises = internalResources.map(async (id) => {
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
  }, [internalResources]);

  useEffect(() => {
    getRelatedRegistrations();
  }, [getRelatedRegistrations]);

  return (
    <>
      {internalResources.length > 0 &&
        (isLoadingRegistrations ? (
          <CircularProgress aria-labelledby="TODO" sx={{ display: 'block' }} />
        ) : (
          <RegistrationList registrations={relatedRegistrations} />
        ))}

      {externalResources.length > 0 && (
        <>
          <Typography variant="overline">Eksterne lenker</Typography>
          <ul>
            {externalResources.map((externalResource) => (
              <li>
                <Link href={externalResource}>{externalResource}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
