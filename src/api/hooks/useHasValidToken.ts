import { useQuery } from '@tanstack/react-query';
import { userIsAuthenticated } from '../authApi';

/**
 * Reports whether the session had a valid (non-expired) token the last time this query ran.
 * Unlike the Redux `user` (populated once at startup), it re-checks via fetchAuthSession when the
 * query mounts, so it can gate authenticated requests.
 */
export const useHasValidToken = () =>
  useQuery({
    queryKey: ['hasValidToken'],
    queryFn: userIsAuthenticated,
    staleTime: 0,
  });
