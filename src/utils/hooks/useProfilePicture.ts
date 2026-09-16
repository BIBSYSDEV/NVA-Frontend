import { useQuery } from '@tanstack/react-query';
import { fetchProfilePicture } from '../../api/cristinApi';

export const useProfilePicture = (id: string) => {
  const isEnabled = !!id;

  const profilePictureQuery = useQuery({
    enabled: isEnabled,
    queryKey: ['picture', id],
    queryFn: () => fetchProfilePicture(id),
    meta: { errorMessage: false },
    retry: false,
    staleTime: Infinity,
  });

  const profilePictureString = profilePictureQuery.isSuccess
    ? `data:image/jpeg;base64,${profilePictureQuery.data.base64Data}`
    : '';

  return { profilePictureQuery, profilePictureString, isEnabled };
};
