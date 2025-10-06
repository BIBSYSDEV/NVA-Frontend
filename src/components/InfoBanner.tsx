import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Paper, PaperProps, Typography } from '@mui/material';

interface InfoBannerProps extends PaperProps {
  text: string;
  size?: 'small' | 'large';
  type: 'info' | 'warning' | 'error';
}

export const InfoBanner = ({ text, type, sx, size = 'large', ...props }: InfoBannerProps) => {
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
        p: size == 'large' ? '1rem' : '0.3rem 2rem',
        bgcolor: `${type}.main`,
        ...sx,
      }}
      {...props}>
      {type === 'info' ? (
        <InfoIcon fontSize={size} sx={{ color: 'white' }} />
      ) : type === 'warning' ? (
        <WarningIcon fontSize={size} sx={{ color: 'primary.main' }} />
      ) : (
        <ErrorIcon fontSize={size} sx={{ color: 'white' }} />
      )}
      <Typography color={type === 'warning' ? 'black' : 'white'}>{text}</Typography>
    </Paper>
  );
};
