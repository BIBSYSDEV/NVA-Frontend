import { useQuery } from '@tanstack/react-query';
import { CristinPerson } from '../../types/user.types';
import { fetchPerson } from '../cristinApi';

interface UseRefetchPersonProps {
  cristinId: string;
  sideEffect: (data: CristinPerson) => void;
  errorMessage: string;
}

export const useRefetchPerson = ({ cristinId, sideEffect, errorMessage }: UseRefetchPersonProps) => {
  return useQuery({
    enabled: false,
    queryKey: ['person', cristinId],
    queryFn: async () => {
      const data = await fetchPerson(cristinId);
      sideEffect(data);
      return data;
    },
    meta: { errorMessage: errorMessage },
  });
};
