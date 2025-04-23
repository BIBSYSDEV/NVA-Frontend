import { useQuery } from '@tanstack/react-query';
import { fetchPublisher } from '../publicationChannelApi';

export const useFetchPublisher = (id: string) => {
  return useQuery({
    queryKey: ['fetchPublisher', id],
    queryFn: () => fetchPublisher(id),
  });
};
