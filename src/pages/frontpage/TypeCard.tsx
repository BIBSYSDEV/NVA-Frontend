import { Box, Link, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { Link as RouterLink } from 'react-router';

interface TypeCardProps {
  text: string;
  icon: React.ReactNode;
  dataTestId: string;
  pathName: string;
  parameters?: string;
}

export const TypeCard = ({ text, icon, dataTestId, pathName, parameters = '' }: TypeCardProps) => {
  return (
    <Link
      component={RouterLink}
      data-testid={dataTestId}
      to={{
        pathname: pathName,
        search: parameters,
      }}
      sx={{ width: '100%', textDecoration: 'none' }}>
      <FrontPageBox
        sx={{ flex: '1', bgcolor: '#EFEFEF', alignItems: 'center', p: '1.5rem', cursor: 'pointer', height: '8rem' }}>
        <Box
          sx={{
            flexGrow: 1,
            alignContent: 'center',
          }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: '0.8rem', textDecoration: 'underline' }}>{text}</Typography>
      </FrontPageBox>
    </Link>
  );
};
