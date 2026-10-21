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

  const title = `${t('search.reports.reports')} - ${reportName}`;

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
