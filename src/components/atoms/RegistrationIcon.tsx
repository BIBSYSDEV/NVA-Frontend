import NotesIcon from '@mui/icons-material/Notes';
import { SxProps } from '@mui/material';

export const RegistrationIcon = ({ sx }: { sx?: SxProps }) => {
  return <NotesIcon sx={{ bgcolor: 'registration.main', borderRadius: '0.4rem', color: 'black', ...sx }} />;
};
