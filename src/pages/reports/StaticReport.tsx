import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { HeadTitle } from '../../components/HeadTitle';
import { useAppLanguageInIso6391Format } from '../../translations/translation-helpers';
import { STATIC_REPORTS_URL } from '../../utils/constants';
import { StaticReportName, staticReportFileNames } from '../../utils/urlPaths';
import NotFound from '../errorpages/NotFound';
import { StyledReportIframe } from './NviReports';

const isStaticReportName = (reportName?: string): reportName is StaticReportName =>
  !!reportName && Object.hasOwn(staticReportFileNames, reportName);

const StaticReport = () => {
  const { t } = useTranslation();
  const { reportName } = useParams<{ reportName: string }>();
  const language = useAppLanguageInIso6391Format();

  if (!STATIC_REPORTS_URL || !isStaticReportName(reportName)) {
    return <NotFound />;
  }

  const titles: Record<StaticReportName, string> = {
    'nvi-categories': t('search.reports.nvi_categories_over_time'),
    'nvi-reporting': t('search.reports.nvi_reporting'),
    'gender-and-age': t('search.reports.gender_and_age'),
    'ten-year-series': t('search.reports.ten_year_series'),
  };
  const title = titles[reportName];

  return (
    <>
      <HeadTitle>{title}</HeadTitle>
      <Typography variant="h1" sx={visuallyHidden}>
        {title}
      </Typography>
      <StyledReportIframe
        title={title}
        src={`${STATIC_REPORTS_URL}/${staticReportFileNames[reportName]}.html?lang=${language}`}
      />
    </>
  );
};

export default StaticReport;
