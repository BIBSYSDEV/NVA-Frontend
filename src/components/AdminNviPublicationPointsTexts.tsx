import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useNviAdminPeriodReportNumbers } from '../hooks/nvi/useNviAdminPeriodReportNumbers';
import { dataTestId } from '../utils/dataTestIds';
import { formatLocaleNumber } from '../utils/general-helpers';
import { useNviCandidatesParams } from '../utils/hooks/useNviCandidatesParams';
import { ExpandableNviTopView } from './ExpandableNviTopView';
import { VerticalBox } from './styled/Wrappers';

export const AdminNviPublicationPointsTexts = () => {
  const { t } = useTranslation();
  const { year } = useNviCandidatesParams();
  const { validPoints, totalCount, percentageComparedToYearBefore, isPending, isError } =
    useNviAdminPeriodReportNumbers(year);

  return (
    <ExpandableNviTopView
      alwaysVisibleText={t('publication_points_description')}
      expandedText={t('publication_points_description_more')}
      testId={dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton}>
      <VerticalBox sx={{ gap: '0.25rem', mt: '1rem' }}>
        {isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : isError || !totalCount || !percentageComparedToYearBefore || !validPoints ? undefined : (
          <Trans
            i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points_that_is_z_percent_of_year"
            values={{
              num_results_approved_by_all: formatLocaleNumber(totalCount),
              total_publicationpoints: formatLocaleNumber(validPoints),
              percentage: percentageComparedToYearBefore,
              year: year - 1,
            }}
            components={{ b: <strong />, p: <Typography gutterBottom /> }}
          />
        )}
      </VerticalBox>
    </ExpandableNviTopView>
  );
};
