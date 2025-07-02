import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { DocumentHeadTitle } from '../../components/DocumentHeadTitle';
import clinicalTreatmentStudiesThumbnail from '../../resources/images/clinical-treatment-studies-thumbnail.png';
import internationalCooperationThumbnail from '../../resources/images/international-cooperation-report-thumbnail.png';
import nviReportThumbnail from '../../resources/images/nvi-report-thumbnail.png';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ReportButton } from './ReportButton';

const headingId = 'reports-page-heading';

const ReportsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <DocumentHeadTitle>{t('search.reports.reports')}</DocumentHeadTitle>
      <Typography id={headingId} variant="h1" sx={visuallyHidden}>
        {t('search.reports.reports')}
      </Typography>
      <Box
        component="nav"
        aria-labelledby={headingId}
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
        <ReportButton
          title={t('search.reports.clinical_treatment_studies')}
          description={t('search.reports.external_reports')}
          imageSrc={clinicalTreatmentStudiesThumbnail}
          path={UrlPathTemplate.ReportsClinicalTreatmentStudies}
        />
      </Box>
    </>
  );
};

export default ReportsPage;
