import { CristinPerson } from '../../types/user.types';
import { useFetchCristinPerson } from './useFetchCristinPerson';

interface UseAddSelfAsContributorProps {
  cristinId: string;
  addContributorFn: (data: CristinPerson) => void;
}

export const useAddSelfAsContributor = ({ cristinId, addContributorFn }: UseAddSelfAsContributorProps) => {
  const personQuery = useFetchCristinPerson(cristinId, { enabled: false });

  const addSelf = async () => {
    const refetchPerson = await personQuery.refetch();
    if (refetchPerson.data) {
      addContributorFn(refetchPerson.data);
    }
  };

  return { addSelf, isFetching: personQuery.isFetching };
};
