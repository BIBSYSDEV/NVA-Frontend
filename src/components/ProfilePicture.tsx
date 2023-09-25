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
    <Box sx={{ height, aspectRatio: '1/1', ...sx }}>
      {profilePictureQuery.isFetching ? (
        <Skeleton variant="circular" sx={{ height: '100%' }} />
      ) : profilePictureQuery.isSuccess ? (
        <Box
          component="img"
          src={profilePictureString}
          alt="profile-picture"
          sx={{
            height: '100%',
            width: '100%',
            borderRadius: '50%',
            border: hasBorder ? '0.125rem solid black' : 'none',
            objectFit: 'cover',
          }}
        />
      ) : (
        <StyledBaseContributorIndicator
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            border: '2px solid black',
            height: '100%',
            width: '100%',
          }}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
          {getContributorInitials(fullName)}
        </StyledBaseContributorIndicator>
      )}
    </Box>
  );
};
