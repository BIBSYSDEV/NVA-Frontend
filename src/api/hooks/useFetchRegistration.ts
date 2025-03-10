import { Query, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../redux/notificationSlice';
import { DeletedRegistrationProblem } from '../../types/error_responses';
import { Registration } from '../../types/registration.types';
import { fetchRegistration } from '../registrationApi';

interface FetchRegistrationConfig {
  enabled?: boolean;
  doNotRedirect?: boolean;
}

export const useFetchRegistration = (
  identifier = '',
  { enabled = true, doNotRedirect = false }: FetchRegistrationConfig = {}
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['registration', identifier, doNotRedirect],
    enabled: enabled && !!identifier,
    queryFn: () => fetchRegistration(identifier, doNotRedirect),
    retry: (failureCount, error: AxiosError<DeletedRegistrationProblem>) => {
      if (error.response?.status === 410) {
        // Do not retry for 410 Gone response, as this will be handled as an success in the meta.handleError function.
        return false;
      }
      return failureCount < 1;
    },
    meta: {
      handleError: (
        error: AxiosError<DeletedRegistrationProblem>,
        query: Query<Registration, AxiosError<DeletedRegistrationProblem>>
      ) => {
        if (error.response?.status === 410) {
          // Fetching an unpublished results will return a 410 Gone (client error) response.
          // The frontend should then use the supplied 'resource' property instead, and treat it as an successful GET.
          const errorRegistration = query.state.error?.response?.data?.resource;
          if (errorRegistration) {
            query.setData(errorRegistration);
          }
        } else {
          dispatch(
            setNotification({
              message: t('feedback.error.get_registration'),
              variant: 'error',
            })
          );
        }
      },
    },
  });
};
