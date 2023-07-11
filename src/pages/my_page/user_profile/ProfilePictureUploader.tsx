import { Box, Button, Typography } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { uploadProfilePicture } from '../../../api/cristinApi';

interface ProfilePictureUploaderProps {
  id: string | undefined;
}

export const ProfilePictureUploader = ({ id }: ProfilePictureUploaderProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64String = reader.result as string;
        const base64String = rawBase64String.replace(/^data:image\/\w+;base64,/, '');

        id && uploadProfilePicture(id, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'white',
        width: 'fit-content',
        aspectRatio: '1/1',
        alignItems: 'center',
        px: '2rem',
        border: 'dashed 2px',
      }}>
      <input
        accept=".jpg, .jpeg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
      />
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
        <Typography>Legg til profilfoto</Typography>
      </Box>
    </Box>
  );
};
