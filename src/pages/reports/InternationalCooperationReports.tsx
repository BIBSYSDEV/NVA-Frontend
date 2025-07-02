import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { HeadTitle } from '../../components/HeadTitle';
import { StyledReportIframe } from './NviReports';

export const InternationalCooperationReports = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadTitle>{t('search.reports.international_cooperation')}</HeadTitle>
      <Typography variant="h1" sx={visuallyHidden}>
        {t('search.reports.international_cooperation')}
      </Typography>
      <StyledReportIframe
        title={t('search.reports.international_cooperation')}
        src="https://rapport-dv.uhad.no/t/DUCT/views/NVI_samarbeid_int_final/Internasjonaltsamarbeid?:embed=y"
      />
    </>
  );
};
