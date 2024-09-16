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
  shouldNotRedirect?: boolean;
}

export const useFetchRegistration = (
  identifier = '',
  { enabled = true, shouldNotRedirect = false }: FetchRegistrationConfig = {}
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ['registration', identifier, shouldNotRedirect],
    enabled: enabled && !!identifier,
    queryFn: () => fetchRegistration(identifier, shouldNotRedirect),
    meta: {
      handleError: (
        error: AxiosError<DeletedRegistrationProblem>,
        query: Query<Registration, AxiosError<DeletedRegistrationProblem>>
      ) => {
        if (error.response?.status === 410) {
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
