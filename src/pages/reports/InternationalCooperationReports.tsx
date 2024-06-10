import { useTranslation } from 'react-i18next';
import { StyledReportIframe } from './NviReports';

export const InternationalCooperationReports = () => {
  const { t } = useTranslation();

  return (
    <StyledReportIframe
      title={t('search.reports.international_cooperation')}
      allow="fullscreen"
      src="https://rapport-dv.uhad.no/t/DUCT/views/NVI_samarbeid_int_final/Internasjonaltsamarbeid?:embed=y"
    />
  );
};
