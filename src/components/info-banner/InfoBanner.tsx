import { Paper, PaperProps, Typography } from '@mui/material';
import { InfoBannerSize, InfoBannerType } from './enums';
import { infoBannerConfig, infoBannerPadding } from './info-banner-config';

interface InfoBannerProps extends PaperProps {
  text: string;
  noElevation?: boolean;
  size?: InfoBannerSize;
  type?: InfoBannerType;
}

export const InfoBanner = ({
  text,
  noElevation = false,
  type = InfoBannerType.INFO,
  size = InfoBannerSize.LARGE,
  sx,
  ...props
}: InfoBannerProps) => {
  const { bgColor, textColor, icon } = infoBannerConfig[type];

  return (
    <Paper
      elevation={noElevation ? 0 : 5}
      sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', p: infoBannerPadding[size], bgcolor: bgColor, ...sx }}
      {...props}>
      {icon(size)}
      <Typography color={textColor}>{text}</Typography>
    </Paper>
  );
};
