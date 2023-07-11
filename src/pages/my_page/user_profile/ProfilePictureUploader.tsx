import { Box, Button, Typography } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { uploadProfilePicture } from '../../../api/cristinApi';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { useState } from 'react';
import { PageSpinner } from '../../../components/PageSpinner';

interface ProfilePictureUploaderProps {
  id: string;
}

export const ProfilePictureUploader = ({ id }: ProfilePictureUploaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
