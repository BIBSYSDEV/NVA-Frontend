import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import internationalCooperationThumbnail from '../../resources/images/international-cooperation-report-thumbnail.png';
import nviReportThumbnail from '../../resources/images/nvi-report-thumbnail.png';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ReportButton } from './ReportButton';

const ReportsPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        px: { xs: '0.25rem', md: 0 },
        mb: '1rem',
      }}>
      <ReportButton
        title={t('common.nvi')}
        description={t('search.reports.external_reports')}
        imageSrc={nviReportThumbnail}
        path={UrlPathTemplate.ReportsNvi}
      />
      <ReportButton
        title={t('search.reports.international_cooperation')}
        description={t('search.reports.external_reports')}
        imageSrc={internationalCooperationThumbnail}
        path={UrlPathTemplate.ReportsInternationalCooperation}
      />
    </Box>
  );
};

export default ReportsPage;
