import InfoIcon from '@mui/icons-material/Info';
import { Paper, PaperProps, Typography } from '@mui/material';

interface InfoBannerProps extends PaperProps {
  text: string;
}

export const InfoBanner = ({ text, sx, ...props }: InfoBannerProps) => {
  return (
    <Paper elevation={5} sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', p: '1rem', ...sx }} {...props}>
      <InfoIcon color="primary" fontSize="large" />
      <Typography>{text}</Typography>
    </Paper>
  );
};
