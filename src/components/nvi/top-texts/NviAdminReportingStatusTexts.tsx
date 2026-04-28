import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { VerticalBox } from '../../styled/Wrappers';
import { useNviPeriodReportNumbers } from '../hooks/useNviPeriodReportNumbers';

export const NviAdminReportingStatusTexts = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const {
    isPending,
    isError,
    numCandidatesForReporting,
    percentageCandidatesComparedToPreviousYear: percentage,
  } = useNviPeriodReportNumbers(year);

  return (
    <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
      <Trans t={t} i18nKey="basic_data.nvi.reporting_status_description" components={{ p: <Typography /> }} />
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : isError || numCandidatesForReporting === undefined ? null : (
        <Trans
          t={t}
          i18nKey="nvi_admin_reporting_status_numbers"
          values={{
            num_results: formatLocaleNumber(numCandidatesForReporting),
            percentage: percentage !== undefined ? formatLocaleNumber(percentage) : '–',
            previous_year: year - 1,
          }}
          components={{
            p: <Typography />,
            b: <strong />,
          }}
        />
      )}
    </VerticalBox>
  );
};
