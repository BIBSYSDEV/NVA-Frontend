import { Box } from '@mui/material';
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
        const base64String = reader.result as string;
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
      }}>
      <input type="file" accept=".jpg, .jpeg" onChange={handleFileChange} />
    </Box>
  );
};
