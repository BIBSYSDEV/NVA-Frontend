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
      src="https://rapport-dv.uhad.no/t/DUCT/views/nettsider_2022_23_04_v9/NVI2011-2023?%3Aembed=y"
    />
  );
};
