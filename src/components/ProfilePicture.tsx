import { Box, BoxProps, Skeleton, SxProps } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchProfilePicture } from '../api/cristinApi';

interface ProfilePictureProps extends Pick<BoxProps, 'sx'> {
  id: string;
  height: string;
  hasBorder?: boolean;
  sx?: SxProps;
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

  return (
    <Box sx={{ height, aspectRatio: '1/1' }}>
      {profilePictureQuery.isFetching ? (
        <Skeleton variant="circular" sx={{ height: '100%' }} />
      ) : (
        <Box
          component="img"
          src={profilePictureString}
          alt="profile-picture"
          sx={{
            height: '100%',
            borderRadius: '50%',
            border: hasBorder ? '0.125rem solid black' : 'none',
            objectFit: 'cover',
            ...sx,
          }}
        />
      )}
    </Box>
  );
};
