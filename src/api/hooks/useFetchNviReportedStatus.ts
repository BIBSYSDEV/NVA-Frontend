import { useQuery } from '@tanstack/react-query';
import { RegistrationStatus } from '../../types/registration.types';
import { fetchNviReportStatusForRegistration } from '../scientificIndexApi';

export const useFetchNviReportedStatus = (registrationId: string, registrationStatus?: RegistrationStatus) => {
  return useQuery({
    enabled: !!registrationId && registrationStatus && registrationStatus !== RegistrationStatus.Draft,
    queryKey: ['nviReportStatus', registrationId],
    queryFn: () => fetchNviReportStatusForRegistration(registrationId),
    retry: false,
    meta: { errorMessage: false },
  });
};
