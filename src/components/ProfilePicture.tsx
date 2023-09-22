import { Box, BoxProps, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchProfilePicture } from '../api/cristinApi';

interface ProfilePictureProps {
  id: string;
  height: string;
  hasBorder?: boolean;
  sx?: BoxProps;
}

export const ProfilePicture = ({ id, height, hasBorder, sx }: ProfilePictureProps) => {
  const profilePictureQuery = useQuery({
    queryKey: ['picture', id],
    queryFn: () => fetchProfilePicture(id),
    meta: { errorMessage: false },
    retry: false,
  });

  const profilePictureString = profilePictureQuery.isSuccess
    ? `data:image/jpeg;base64,${profilePictureQuery.data.base64Data}`
    : '';

  return profilePictureQuery.isFetching ? (
    <Skeleton variant="circular" sx={{ height: height, aspectRatio: '1/1' }} />
  ) : (
    <Box
      component="img"
      src={profilePictureString}
      alt="profile-picture"
      sx={{
        aspectRatio: '1/1',
        height: height,
        borderRadius: '50%',
        border: hasBorder ? '0.125rem solid black' : 'none',
        objectFit: 'cover',
        ...sx,
      }}
    />
  );
};
