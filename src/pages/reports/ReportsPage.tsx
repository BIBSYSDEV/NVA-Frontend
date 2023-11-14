import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import internationalCooperationThumbnail from '../../resources/images/international-cooperation-report-thumbnail.png';
import nviReportThumbnail from '../../resources/images/nvi-report-thumbnail.png';
import { UrlPathTemplate } from '../../utils/urlPaths';

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

interface ReportButtonProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

const ReportButton = ({ title, description, imageSrc, path }: ReportButtonProps) => (
  <Button
    component={Link}
    to={path}
    sx={{
      border: '2px solid',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      textTransform: 'none',
      justifySelf: { xs: 'center', md: 'start' },
    }}>
    <img src={imageSrc} alt="" style={{ height: '10rem', width: '14rem' }} />
    <Typography variant="h3">{title}</Typography>
    <Typography>{description}</Typography>
  </Button>
);
