import { Box, Link, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { Link as RouterLink } from 'react-router';

interface TypeCardProps {
  text: string;
  icon: React.ReactNode;
  dataTestId: string;
  to: {
    pathname: string;
    search?: string;
  };
}

export const TypeCard = ({ text, icon, dataTestId, to }: TypeCardProps) => {
  return (
    <Link component={RouterLink} data-testid={dataTestId} to={to} sx={{ width: '100%' }}>
      <FrontPageBox sx={{ flex: '1', bgcolor: '#EFEFEF', alignItems: 'center', p: '1.5rem', height: '8rem' }}>
        <Box sx={{ flexGrow: 1, alignContent: 'center' }}>{icon}</Box>
        <Typography sx={{ fontSize: '0.8rem' }}>{text}</Typography>
      </FrontPageBox>
    </Link>
  );
};
