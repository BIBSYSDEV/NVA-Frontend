import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StyledReportIframe = styled('iframe')({
  border: 'none',
  width: '100%',
  height: '70vh',
  maxHeight: '65rem',
});

export const NviReports = () => {
  const { t } = useTranslation();

  return (
    <StyledReportIframe
      title={t('common.nvi')}
      src="https://rapport-dv.uhad.no/t/DUCT/views/nettsider_2022_14_04_v2/NVI2011-2022?%3Aembed=y&%3AloadOrderID=0&%3Adisplay_spinner=yes&%3AshowAppBanner=false&%3Atoolbar=yes&%3Atabs=no"
    />
  );
};
