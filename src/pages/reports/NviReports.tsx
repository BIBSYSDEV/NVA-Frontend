import { styled, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { HeadTitle } from '../../components/HeadTitle';

export const StyledReportIframe = styled('iframe')({
  border: 'none',
  width: '100%',
  height: '70vh',
  maxHeight: '65rem',
});

const NviReports = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadTitle>{t('common.nvi')}</HeadTitle>
      <Typography variant="h1" sx={visuallyHidden}>
        {t('common.nvi')}
      </Typography>
      <StyledReportIframe
        title={t('common.nvi')}
        src="https://rapport-dv-test.educloud.no/t/DUCT/views/nettsider_2022_23_04_v9/NVI2011-2023?%3Aembed=y"
      />
    </>
  );
};

export default NviReports;
