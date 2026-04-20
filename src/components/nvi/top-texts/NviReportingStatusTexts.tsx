import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { VerticalBox } from '../../styled/Wrappers';

interface NviReportingStatusTextsProps {
  yearBefore?: number;
  numResults?: number;
  percentage?: number;
  isPending?: boolean;
  isError?: boolean;
}

export const NviReportingStatusTexts = ({
  yearBefore,
  isPending = false,
  isError = false,
  numResults,
  percentage,
}: NviReportingStatusTextsProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
      <Trans t={t} i18nKey="reporting_status_description" components={[<Typography key="1" />]} />
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : isError || numResults === undefined || percentage === undefined || yearBefore === undefined ? null : (
        <Trans
          t={t}
          i18nKey="reporting_status_numbers"
          values={{
            num_results: formatLocaleNumber(numResults),
            percentage: formatLocaleNumber(percentage),
            yearBefore: yearBefore,
          }}
          components={{
            p: <Typography />,
            b: <Typography component="strong" sx={{ fontWeight: 'bold' }} />,
          }}
        />
      )}
    </VerticalBox>
  );
};
