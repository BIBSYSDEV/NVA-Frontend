import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { VerticalBox } from '../../styled/Wrappers';

interface NviAdminReportingStatusTextsProps {
  previousYear?: number;
  totalResults?: number;
  percentage?: number;
  isPending?: boolean;
  isError?: boolean;
}

export const NviAdminReportingStatusTexts = ({
  previousYear,
  isPending = false,
  isError = false,
  totalResults,
  percentage,
}: NviAdminReportingStatusTextsProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
      <Trans t={t} i18nKey="basic_data.nvi.reporting_status_description" components={{ p: <Typography /> }} />
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : isError || totalResults === undefined || previousYear === undefined ? null : (
        <Trans
          t={t}
          i18nKey="nvi_admin_reporting_status_numbers"
          values={{
            num_results: formatLocaleNumber(totalResults),
            percentage: percentage !== undefined ? formatLocaleNumber(percentage) : '–',
            previous_year: previousYear,
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
