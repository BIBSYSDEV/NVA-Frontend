import InfoIcon from '@mui/icons-material/Info';
import { Paper, PaperProps, Typography } from '@mui/material';

interface InfoBannerProps extends PaperProps {
  text: string;
}

export const InfoBanner = ({ text, sx, ...props }: InfoBannerProps) => {
  return (
    <Paper
      elevation={5}
      sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', p: '1rem', bgcolor: 'info.main', ...sx }}
      {...props}>
      <InfoIcon fontSize="large" sx={{ color: 'white' }} />
      <Typography color="white">{text}</Typography>
    </Paper>
  );
};
