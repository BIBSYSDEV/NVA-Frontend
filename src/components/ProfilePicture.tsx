import { Box, BoxProps, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { StyledBaseContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import { dataTestId } from '../utils/dataTestIds';
import { getInitials } from '../utils/general-helpers';
import { useProfilePicture } from '../utils/hooks/useProfilePicture';

interface ProfilePictureProps extends Pick<BoxProps, 'sx'> {
  personId: string;
  fullName: string;
  isPublicPage?: boolean;
}

export const ProfilePicture = ({ personId, fullName, isPublicPage = false, sx }: ProfilePictureProps) => {
  const { t } = useTranslation();
  const { profilePictureQuery, profilePictureString } = useProfilePicture(personId);

  return (
    <Box sx={{ height: '2.5rem ', aspectRatio: '1/1', borderRadius: '50%', ...sx }}>
      {profilePictureQuery.isPending ? (
        <Skeleton variant="circular" sx={{ height: '100%' }} />
      ) : profilePictureQuery.isSuccess ? (
        <Box
          component="img"
          src={profilePictureString}
          alt={t('my_page.my_profile.profile_picture')}
          sx={{
            height: '100%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            border: '0.125rem solid black',
            objectFit: 'cover',
          }}
        />
      ) : (
        <StyledBaseContributorIndicator
          sx={{
            bgcolor: isPublicPage ? 'white' : 'primary.main',
            color: isPublicPage ? 'primary.main' : 'primary.contrastText',
            border: isPublicPage ? '0.125rem solid black' : 'none',
            height: '100%',
            width: '100%',
          }}
          data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
          {getInitials(fullName)}
        </StyledBaseContributorIndicator>
      )}
    </Box>
  );
};
