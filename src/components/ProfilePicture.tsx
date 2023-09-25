import { Box, BoxProps, Skeleton, SxProps } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchProfilePicture } from '../api/cristinApi';
import { StyledBaseContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import { dataTestId } from '../utils/dataTestIds';
import { getContributorInitials } from '../utils/registration-helpers';

interface ProfilePictureProps extends Pick<BoxProps, 'sx'> {
  id: string;
  fullName: string;
  height: string;
  hasBorder?: boolean;
  sx?: SxProps;
}

export const ProfilePicture = ({ id, fullName, height, hasBorder, sx }: ProfilePictureProps) => {
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
      ) : profilePictureQuery.isSuccess ? (
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
      ) : (
        <StyledBaseContributorIndicator
          sx={{ bgcolor: 'primary.main', color: 'white', height: '2.5rem', width: '2.5rem', fontSize: '1.5rem' }}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
          {getContributorInitials(fullName)}
        </StyledBaseContributorIndicator>
      )}
    </Box>
  );
};
