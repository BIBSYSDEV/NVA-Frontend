import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { uploadProfilePicture } from '../../../api/cristinApi';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { setNotification } from '../../../redux/notificationSlice';
import { dataTestId } from '../../../utils/dataTestIds';
import { useProfilePicture } from '../../../utils/hooks/useProfilePicture';

interface ProfilePictureUploaderProps {
  personId: string;
}

export const ProfilePictureUploader = ({ personId }: ProfilePictureUploaderProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const toggleConfirmDialog = () => setOpenConfirmDialog(!openConfirmDialog);

  const { profilePictureQuery, profilePictureString } = useProfilePicture(personId);

  const mutateProfilePicture = useMutation({
    mutationFn: (base64String: string) => uploadProfilePicture(personId, base64String),
    onSuccess: async () => {
      await profilePictureQuery.refetch();
      dispatch(setNotification({ message: t('feedback.success.update_profile_photo'), variant: 'success' }));
    },
    onError: () => {
      dispatch(setNotification({ message: t('feedback.error.update_profile_photo'), variant: 'error' }));
    },
  });

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
    <Box sx={{ display: 'flex', width: '12rem', height: '12rem', justifyContent: 'center', my: '1rem' }}>
      {profilePictureQuery.isFetching || mutateProfilePicture.isPending ? (
        <Skeleton variant="circular" sx={{ height: '100%', aspectRatio: '1/1' }} />
      ) : profilePictureQuery.isSuccess ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <IconButton
            data-testid={dataTestId.myPage.myProfile.deleteProfilePictureButton}
            onClick={toggleConfirmDialog}
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

          <Box
            component="img"
            src={profilePictureString}
            alt={t('my_page.my_profile.profile_picture')}
            sx={{
              aspectRatio: '1/1',
              width: '100%',
              borderRadius: '50%',
              border: '0.125rem solid black',
              objectFit: 'cover',
            }}
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
          <Typography align="center">{t('my_page.my_profile.identity.upload_profile_photo_info')}</Typography>
        </Box>
      )}
      <ConfirmDialog
        open={openConfirmDialog}
        title={t('my_page.my_profile.remove_profile_picture')}
        onAccept={async () => {
          await mutateProfilePicture.mutateAsync('');
          toggleConfirmDialog();
        }}
        onCancel={toggleConfirmDialog}
        isLoading={mutateProfilePicture.isPending}
        dialogDataTestId={dataTestId.myPage.myProfile.removeProfilePictureDialog}>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{t('my_page.my_profile.remove_profile_picture_info')}</Typography>
      </ConfirmDialog>
    </Box>
  );
};
