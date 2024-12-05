import { useQuery } from '@tanstack/react-query';
import { CristinPerson } from '../../types/user.types';
import { fetchPerson } from '../cristinApi';

interface UseRefetchPersonProps {
  userCristinId: string;
  sideEffect: (data: CristinPerson) => void;
  errorMessage: string;
}

export const useRefetchPerson = ({ userCristinId, sideEffect, errorMessage }: UseRefetchPersonProps) => {
  return useQuery({
    enabled: false,
    queryKey: ['currentUser', userCristinId],
    queryFn: async () => {
      const data = await fetchPerson(userCristinId);
      sideEffect(data);
      return data;
    },
    meta: { errorMessage: errorMessage },
  });
};
