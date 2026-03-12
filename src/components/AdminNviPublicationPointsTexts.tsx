import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchNviPeriodReport } from '../api/hooks/useFetchNviPeriodReport';
import { dataTestId } from '../utils/dataTestIds';
import { formatNumber } from '../utils/general-helpers';
import { getDefaultNviYear } from '../utils/hooks/useNviCandidatesParams';
import { ExpandableNviTopView } from './ExpandableNviTopView';
import { VerticalBox } from './styled/Wrappers';

export const AdminNviPublicationPointsTexts = () => {
  const { t } = useTranslation();
  const year = getDefaultNviYear();
  const periodReport = useFetchNviPeriodReport({ year });
  const periodReportLastYear = useFetchNviPeriodReport({ year: year - 1 });
  const periodTotals = periodReport.data?.totals;
  const periodTotalsLastYear = periodReportLastYear.data?.totals;

  return (
    <ExpandableNviTopView
      alwaysVisibleText={t('publication_points_description')}
      expandedText={t('publication_points_description_more')}
      testId={dataTestId.basicData.nvi.publicationPointsExpandDescriptionButton}>
      <VerticalBox sx={{ gap: '0.5rem', mt: '1rem' }}>
        {periodReport.isPending ? (
          <Skeleton sx={{ width: '50%' }} />
        ) : periodReport.isError || !periodTotals ? undefined : (
          <Typography>
            <Trans
              i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points"
              values={{
                num_results: formatNumber(periodTotals.undisputedTotalCount),
                total_publicationpoints: formatNumber(periodTotals.validPoints),
              }}
              components={{ b: <strong /> }}
            />
          </Typography>
        )}
        {periodReport.isPending || periodReportLastYear.isPending ? (
          <VerticalBox>
            <Skeleton sx={{ width: '40%' }} />
            <Skeleton sx={{ width: '40%' }} />
          </VerticalBox>
        ) : periodReport.isError ||
          periodReportLastYear.isError ||
          !periodTotals ||
          !periodTotalsLastYear ? undefined : (
          <>
            <Typography>
              <Trans
                i18nKey="percent_of_published_reports_in_year"
                values={{
                  percentage:
                    periodTotalsLastYear.undisputedTotalCount > 0
                      ? formatNumber(
                          Math.round(
                            (periodTotals.undisputedTotalCount / periodTotalsLastYear.undisputedTotalCount) * 100
                          )
                        )
                      : '-',
                  year: year - 1,
                }}
                components={{ b: <strong /> }}
              />
            </Typography>
          </>
        )}
      </VerticalBox>
    </ExpandableNviTopView>
  );
};
