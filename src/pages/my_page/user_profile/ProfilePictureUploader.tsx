import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchProfilePicture, uploadProfilePicture } from '../../../api/cristinApi';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';

interface ProfilePictureUploaderProps {
  id: string;
}

export const ProfilePictureUploader = ({ id }: ProfilePictureUploaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const profilePictureQuery = useQuery({
    queryKey: ['picture', id],
    queryFn: () => fetchProfilePicture(id),
    meta: { errorMessage: false },
    retry: false,
  });

  const mutateProfilePicture = useMutation({
    mutationFn: (base64String: string) => uploadProfilePicture(id, base64String),
    onSuccess: async () => {
      await profilePictureQuery.refetch();
      dispatch(setNotification({ message: t('feedback.success.update_profile_photo'), variant: 'success' }));
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.update_profile_photo'), variant: 'error' }));
    },
  });

  const profilePictureString = profilePictureQuery.isSuccess
    ? `data:image/jpeg;base64,${profilePictureQuery.data.base64Data}`
    : '';

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
        mutateProfilePicture.mutate(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '12rem', height: '12rem', justifyContent: 'center' }}>
      {profilePictureQuery.isFetching || mutateProfilePicture.isLoading ? (
        <Skeleton variant="circular" sx={{ height: '100%', aspectRatio: '1/1' }} />
      ) : profilePictureQuery.isSuccess ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <IconButton
            data-testid={dataTestId.myPage.myProfile.deleteProfilePictureButton}
            onClick={() => mutateProfilePicture.mutate('')}
            sx={{
              alignSelf: 'end',
              boxShadow: '0px 10px 10px -8px rgba(0,0,0,0.75)',
              bgcolor: 'white',
              position: 'absolute',
              '&:hover': {
                bgcolor: 'white',
              },
            }}>
            <CancelIcon color="primary" />
          </IconButton>

          <img
            src={profilePictureString}
            alt="user-avatar"
            style={{ aspectRatio: '1/1', width: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            bgcolor: 'white',
            width: '100%',
            alignItems: 'center',
            border: 'solid 2px',
            borderRadius: '4px',
            justifyContent: 'center',
          }}>
          <IconButton
            data-testid={dataTestId.myPage.myProfile.uploadProfilePictureButton}
            sx={{
              boxShadow: '0px 10px 10px -8px rgba(0,0,0,0.75)',
              p: '1rem',
            }}
            component="label">
            <AddAPhotoIcon color="primary" />
            <input accept=".jpg, .jpeg" onChange={handleFileChange} hidden type="file" />
          </IconButton>
          <Typography>{t('my_page.my_profile.identity.upload_profile_photo')}</Typography>
        </Box>
      )}
    </Box>
  );
};
