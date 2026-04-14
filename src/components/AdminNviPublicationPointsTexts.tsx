import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchNviPeriodReport } from '../api/hooks/useFetchNviPeriodReport';
import { ExportNviStatusLink } from '../pages/messages/components/ExportNviStatusLink';
import { HelperTextModal } from '../pages/registration/HelperTextModal';
import { dataTestId } from '../utils/dataTestIds';
import { formatLocaleNumber } from '../utils/general-helpers';
import { getDefaultNviYear } from '../utils/hooks/useNviCandidatesParams';
import { ExpandableNviTopView } from './ExpandableNviTopView';
import { HorizontalBox, VerticalBox } from './styled/Wrappers';

export const AdminNviPublicationPointsTexts = () => {
  const { t } = useTranslation();
  const year = getDefaultNviYear();
  const periodReport = useFetchNviPeriodReport({ year, hideErrorMessage: true });
  const periodReportLastYear = useFetchNviPeriodReport({ year: year - 1, hideErrorMessage: true });
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
          <HorizontalBox>
            <Trans
              i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points"
              values={{
                approvals: formatLocaleNumber(periodTotals.undisputedTotalCount),
                publication_points: formatLocaleNumber(periodTotals.validPoints),
              }}
              components={{ p: <Typography />, b: <strong />, link: <ExportNviStatusLink isOnAdminPage /> }}
            />
            <HelperTextModal modalTitle={t('export_dataset_for_nvi_report')}>
              <Trans i18nKey="export_dataset_for_nvi_report_description" components={{ p: <Typography /> }} />
            </HelperTextModal>
          </HorizontalBox>
        )}
        {periodReport.isPending || periodReportLastYear.isPending ? (
          <Skeleton sx={{ width: '40%' }} />
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
                      ? formatLocaleNumber(
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
