import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WarningIcon from '@mui/icons-material/Warning';
import { ReactElement } from 'react';
import { InfoBannerSize, InfoBannerType } from './enums';

interface InfoBannerConfigProps {
  bgColor: string;
  textColor: string;
  icon: (size: InfoBannerSize) => ReactElement;
}

export const infoBannerPadding: Record<InfoBannerSize, string> = {
  [InfoBannerSize.LARGE]: '1rem',
  [InfoBannerSize.MEDIUM]: '0.5rem',
  [InfoBannerSize.SMALL]: '0.3rem 2rem',
};

export const infoBannerConfig: Record<InfoBannerType, InfoBannerConfigProps> = {
  [InfoBannerType.INFO]: {
    bgColor: 'info.main',
    textColor: 'white',
    icon: (size) => <InfoIcon fontSize={size} sx={{ color: 'white' }} />,
  },
  [InfoBannerType.INFO_LIGHT]: {
    bgColor: '#E6F0FF',
    textColor: 'black',
    icon: (size) => <InfoIcon fontSize={size} sx={{ color: 'blue' }} />,
  },
  [InfoBannerType.WARNING]: {
    bgColor: 'warning.main',
    textColor: 'black',
    icon: (size) => <WarningIcon fontSize={size} sx={{ color: 'primary.main' }} />,
  },
  [InfoBannerType.ERROR]: {
    bgColor: 'error.main',
    textColor: 'white',
    icon: (size) => <ErrorIcon fontSize={size} sx={{ color: 'white' }} />,
  },
  [InfoBannerType.LOCK]: {
    bgColor: 'grey.400',
    textColor: 'black',
    icon: (size) => <LockOutlinedIcon fontSize={size} sx={{ color: 'black' }} />,
  },
};
