import { Box, Button, IconButton, Skeleton, Typography } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { fetchProfilePicture, uploadProfilePicture } from '../../../api/cristinApi';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { useState } from 'react';
import { PageSpinner } from '../../../components/PageSpinner';
import { useQuery } from '@tanstack/react-query';

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
    meta: { errorMessage: t('feedback.error.get_profile_picture') },
  });

  const profilePictureString = `data:image/jpeg;base64,${profilePictureQuery.data?.base64Data}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setIsLoading(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawBase64String = reader.result as string;
        const base64String = rawBase64String.replace(/^data:image\/\w+;base64,/, '');
        const uploadProfilePictureResponse = await uploadProfilePicture(id, base64String);

        if (isErrorStatus(uploadProfilePictureResponse.status)) {
          dispatch(setNotification({ message: t('feedback.error.upload_profile_photo'), variant: 'error' }));
          setIsLoading(false);
        } else if (isSuccessStatus(uploadProfilePictureResponse.status)) {
          dispatch(setNotification({ message: t('feedback.success.upload_profile_photo'), variant: 'success' }));
          setIsLoading(false);
          profilePictureQuery.refetch();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return profilePictureQuery.isLoading ? (
    <Skeleton variant="circular" width={'10rem'} height={'10rem'} />
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
