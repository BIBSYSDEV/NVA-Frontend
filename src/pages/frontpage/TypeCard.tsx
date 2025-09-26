import { Link, LinkProps, Skeleton, Typography } from '@mui/material';
import { FrontPageBox } from './styles';
import { Link as RouterLink, To } from 'react-router';
import { VerticalBox } from '../../components/styled/Wrappers';

interface TypeCardProps extends Pick<LinkProps, 'sx'> {
  text: string;
  icon: React.ReactNode;
  dataTestId: string;
  to: To;
  number?: number;
  isLoadingNumber?: boolean;
}

export const TypeCard = ({ sx, text, icon, dataTestId, to, number, isLoadingNumber }: TypeCardProps) => {
  return (
    <Link component={RouterLink} data-testid={dataTestId} to={to} sx={{ width: '100%', textDecoration: 'none', ...sx }}>
      <FrontPageBox
        sx={{
          flex: '1',
          bgcolor: '#EFEFEF',
          alignItems: 'center',
          p: '1.25rem 0.75rem',
          height: '9rem',
          gap: '0.25rem',
          borderRadius: '0.5rem',
        }}>
        <VerticalBox sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {icon}
          {number ? (
            <Typography sx={{ fontSize: '1.25rem', fontWeight: '900', color: '#120732' }}>
              {number.toLocaleString('nb-NO')}
            </Typography>
          ) : isLoadingNumber ? (
            <Skeleton width={70} height={30} />
          ) : null}
        </VerticalBox>
        <Typography
          sx={{
            fontSize: { xs: '0.75rem', sm: '0.8rem' },
            color: '#120732',
            wordBreak: 'break-word',
            textAlign: 'center',
            textDecoration: 'underline',
          }}>
          {text}
        </Typography>
      </FrontPageBox>
    </Link>
  );
};
