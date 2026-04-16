import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { VerticalBox } from '../../styled/Wrappers';

export enum NviStatusViewVariant {
  Curator = 'curator',
  Admin = 'admin',
}

interface NviStatusTopViewTextProps {
  variant: NviStatusViewVariant;
  numResults?: number;
  percentageComparedToYearBefore?: number;
  yearBefore?: number;
  isPending: boolean;
}

export const NviStatusTopViewText = ({
  variant,
  numResults,
  percentageComparedToYearBefore,
  yearBefore,
  isPending,
}: NviStatusTopViewTextProps) => {
  const { t } = useTranslation();

  return (
    <VerticalBox sx={{ mb: '1rem', gap: '0.5rem' }}>
      <Trans
        t={t}
        i18nKey={
          variant === NviStatusViewVariant.Admin
            ? 'basic_data.nvi.reporting_status_description'
            : 'reporting_status_description'
        }
        components={{ p: <Typography gutterBottom /> }}
      />
      {isPending ? (
        <Skeleton sx={{ width: '50%' }} />
      ) : numResults !== undefined && percentageComparedToYearBefore !== undefined && yearBefore !== undefined ? (
        <Typography>
          <Trans
            i18nKey="x_results_are_ready_for_reporting_and_that_is_y_of_number_reported_in_z"
            values={{
              num_results: formatLocaleNumber(numResults),
              percentage_of_year_before: formatLocaleNumber(percentageComparedToYearBefore),
              year_before: yearBefore,
            }}
            components={{ b: <strong /> }}
          />
        </Typography>
      ) : null}
    </VerticalBox>
  );
};
