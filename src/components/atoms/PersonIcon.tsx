import PersonIconMui from '@mui/icons-material/Person';
import { BoxProps } from '@mui/material';

export const PersonIcon = ({ sx = {} }: { sx?: BoxProps['sx'] }) => {
  return <PersonIconMui sx={{ bgcolor: 'person.main', borderRadius: '0.4rem', color: 'black', ...sx }} />;
};
