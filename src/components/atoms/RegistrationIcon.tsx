import NotesIcon from '@mui/icons-material/Notes';
import { BoxProps } from '@mui/material';

export const RegistrationIcon = ({ sx = {} }: { sx?: BoxProps['sx'] }) => {
  return <NotesIcon sx={{ bgcolor: 'registration.main', borderRadius: '0.4rem', color: 'black', ...sx }} />;
};
