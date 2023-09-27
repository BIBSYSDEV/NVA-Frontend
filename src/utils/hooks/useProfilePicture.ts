import { useQuery } from '@tanstack/react-query';
import { fetchProfilePicture } from '../../api/cristinApi';

export const useProfilePicture = (id: string) => {
  const profilePictureQuery = useQuery({
    queryKey: ['picture', id],
    queryFn: () => fetchProfilePicture(id),
    meta: { errorMessage: false },
    retry: false,
  });

  const profilePictureString = profilePictureQuery.isSuccess
    ? `data:image/jpeg;base64,${profilePictureQuery.data.base64Data}`
    : '';

  return { profilePictureQuery, profilePictureString };
};
