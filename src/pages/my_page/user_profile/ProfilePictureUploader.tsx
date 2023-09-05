import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchProfilePicture, uploadProfilePicture } from '../../../api/cristinApi';
import { PageSpinner } from '../../../components/PageSpinner';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';

interface ProfilePictureUploaderProps {
  id: string;
}

export const ProfilePictureUploader = ({ id }: ProfilePictureUploaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const profilePictureQuery = useQuery({
    queryKey: ['picture', id],
    queryFn: () => fetchProfilePicture(id),
    retry: false,
  });

  const mutateProfilePicture = useMutation({
    mutationFn: (base64String: string) => uploadProfilePicture(id, base64String),
    onSuccess: () => {
      dispatch(setNotification({ message: t('feedback.success.upload_profile_photo'), variant: 'success' }));
      profilePictureQuery.refetch();
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.upload_profile_photo'), variant: 'error' }));
    },
  });

  const profilePictureString = profilePictureQuery.isSuccess
    ? `data:image/jpeg;base64,${profilePictureQuery.data?.base64Data}`
    : '';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setIsLoading(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).replace(/^data:image\/\w+;base64,/, '');
        mutateProfilePicture.mutate(base64String);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return profilePictureQuery.isFetching ? (
    <Skeleton variant="circular" width={'12rem'} height={'12rem'} />
  ) : profilePictureQuery.data?.base64Data ? (
    <Box sx={{ display: 'flex', width: '12rem', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
        <input
          accept=".jpg, .jpeg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
        />
        <label htmlFor="raised-button-file" style={{ alignSelf: 'end', marginRight: '3.3rem' }}>
          <IconButton
            data-testid={dataTestId.myPage.myProfile.updateProfilePictureButton}
            sx={{
              border: 'hidden',
              borderRadius: '50%',
              scale: '0.8',
              aspectRatio: '1/1',
              boxShadow: '0px 10px 10px -8px rgba(0,0,0,0.75)',
              bgcolor: 'white',
              position: 'absolute',
              '&:hover': {
                bgcolor: 'white',
              },
            }}
            component="span">
            <AddAPhotoIcon fontSize="large" sx={{ color: 'primary.main' }} />
          </IconButton>
        </label>
        <img
          src={profilePictureString}
          alt="user-avatar"
          style={{ objectFit: 'cover', width: '10rem', height: '10rem', borderRadius: '50%' }}
        />
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'white',
        width: '12.5rem',
        aspectRatio: '1/1',
        alignItems: 'center',
        px: '2rem',
        border: 'dashed 2px',
        justifyContent: 'center',
      }}>
      <input
        accept=".jpg, .jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
      />
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <label htmlFor="raised-button-file">
            <Button
              data-testid={dataTestId.myPage.myProfile.uploadProfilePictureButton}
              sx={{
                border: 'hidden',
                borderRadius: '50%',
                width: 'fit-content',
                aspectRatio: '1/1',
                boxShadow: '0px 10px 10px -8px rgba(0,0,0,0.75)',
              }}
              variant="outlined"
              component="span">
              <AddAPhotoIcon />
            </Button>
          </label>
          <Typography>{t('my_page.my_profile.identity.upload_profile_photo')}</Typography>
        </Box>
      )}
    </Box>
  );
};
