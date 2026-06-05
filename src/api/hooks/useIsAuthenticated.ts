import { useQuery } from '@tanstack/react-query';
import { userIsAuthenticated } from '../authApi';

/**
 * Reactively reports whether the current session has a valid (non-expired) token.
 * Unlike the Redux `user`, which is populated once at startup and goes stale when the token
 * expires, this reflects the live token state and can be used to gate authenticated requests.
 */
export const useIsAuthenticated = () =>
  useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: userIsAuthenticated,
    staleTime: 0,
  });
