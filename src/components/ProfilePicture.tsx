import { Box, BoxProps, Skeleton, SxProps } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { StyledBaseContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import { dataTestId } from '../utils/dataTestIds';
import { useProfilePicture } from '../utils/hooks/useProfilePicture';
import { getContributorInitials } from '../utils/registration-helpers';

interface ProfilePictureProps extends Pick<BoxProps, 'sx'> {
  id: string;
  fullName: string;
  height: string;
  hasBorder?: boolean;
  sx?: SxProps;
}

export const ProfilePicture = ({ id, fullName, height, hasBorder, sx }: ProfilePictureProps) => {
  const { profilePictureQuery, profilePictureString } = useProfilePicture(id);
  const isPublicPage = useLocation().pathname.includes('research-profile');

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
            bgcolor: isPublicPage ? 'white' : 'primary.main',
            color: isPublicPage ? 'primary.main' : 'primary.contrastText',
            border: isPublicPage ? '2px solid black' : 'none',
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
