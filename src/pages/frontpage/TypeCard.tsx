import { Link, LinkProps, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { Link as RouterLink, To } from 'react-router';
import { VerticalBox } from '../../components/styled/Wrappers';

interface TypeCardProps extends Pick<LinkProps, 'sx'> {
  text: string;
  icon: React.ReactNode;
  dataTestId: string;
  to: To;
  number?: number;
}

export const TypeCard = ({ sx, text, icon, dataTestId, to, number }: TypeCardProps) => {
  return (
    <Link component={RouterLink} data-testid={dataTestId} to={to} sx={{ width: '100%', textDecoration: 'none', ...sx }}>
      <FrontPageBox
        sx={{
          flex: '1',
          bgcolor: '#EFEFEF',
          alignItems: 'center',
          p: '1.5rem',
          height: '9rem',
          gap: '0.25rem',
          borderRadius: '0.5rem',
        }}>
        <VerticalBox sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {icon}
          {number && (
            <Typography sx={{ fontSize: '1.25rem', fontWeight: '900', color: '#120732' }}>
              {number.toLocaleString('nb-NO')}
            </Typography>
          )}
        </VerticalBox>
        <Typography sx={{ fontSize: '0.8rem', textDecoration: 'underline', color: '#120732' }}>{text}</Typography>
      </FrontPageBox>
    </Link>
  );
};
