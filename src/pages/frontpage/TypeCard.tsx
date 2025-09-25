import { Box, Link, LinkProps, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { Link as RouterLink, To } from 'react-router';

interface TypeCardProps extends Pick<LinkProps, 'sx'> {
  text: string;
  icon: React.ReactNode;
  dataTestId: string;
  to: To;
}

export const TypeCard = ({ sx = {}, text, icon, dataTestId, to }: TypeCardProps) => {
  return (
    <Link component={RouterLink} data-testid={dataTestId} to={to} sx={{ width: '100%', ...sx }}>
      <FrontPageBox
        sx={{
          flex: '1',
          bgcolor: '#EFEFEF',
          alignItems: 'center',
          p: '1.5rem',
          height: '8rem',
          borderRadius: '0.5rem',
        }}>
        <Box sx={{ flexGrow: 1, alignContent: 'center' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.8rem', color: '#120732' }}>{text}</Typography>
      </FrontPageBox>
    </Link>
  );
};
