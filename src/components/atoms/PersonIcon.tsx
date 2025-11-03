import PersonIconMui from '@mui/icons-material/Person';
import { SxProps } from '@mui/material';

export const PersonIcon = ({ sx }: { sx?: SxProps }) => {
  return <PersonIconMui sx={{ bgcolor: 'person.main', borderRadius: '0.4rem', color: 'black', ...sx }} />;
};
