import { Skeleton, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchNviInstitutionStatus } from '../../../api/hooks/useFetchNviStatus';
import { ExportNviStatusLink } from '../../../pages/messages/components/ExportNviStatusLink';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { formatLocaleNumber } from '../../../utils/general-helpers';
import { getDefaultNviYear } from '../../../utils/hooks/useNviCandidatesParams';
import { ExpandableNviTopView } from '../../ExpandableNviTopView';
import { HorizontalBox, VerticalBox } from '../../styled/Wrappers';

interface NviPublicationPointsTextsProps {
  aggregationsQuery: UseQueryResult<NviInstitutionStatusResponse, Error>;
  exportAcronym?: string;
}

export const NviPublicationPointsTexts = ({ aggregationsQuery, exportAcronym }: NviPublicationPointsTextsProps) => {
  const { t } = useTranslation();
  const aggregations = aggregationsQuery.data;
  const lastYear = getDefaultNviYear() - 1;
  const nviStatusLastYearQuery = useFetchNviInstitutionStatus(lastYear);
  const aggregationsLastYear = nviStatusLastYearQuery.data;
  const percentageApprovedComparedToLastYear =
    aggregationsLastYear && aggregations && aggregationsLastYear.totals.globalApprovalStatus.Approved > 0
      ? (aggregations.totals.globalApprovalStatus.Approved /
          aggregationsLastYear.totals.globalApprovalStatus.Approved) *
        100
      : -1;

  return (
    <ExpandableNviTopView
      alwaysVisibleText={t('nvi_publication_points_page_description')}
      expandedText={t('nvi_publication_points_page_description_expanded')}
      testId={dataTestId.basicData.nvi.curatorPublicationPointsExpandDescriptionButton}>
      <VerticalBox sx={{ gap: '0.25rem' }}>
        {aggregationsQuery.isPending ? (
          <Skeleton sx={{ width: { xs: '20rem', sm: '35rem' } }} />
        ) : aggregationsQuery.isError || !aggregations ? null : (
          <HorizontalBox sx={{ mt: '1rem', gap: '0.25rem', mb: '0.5rem' }}>
            <Trans
              t={t}
              i18nKey="x_results_are_ready_for_reporting_and_they_give_y_publication_points"
              values={{
                approvals: formatLocaleNumber(aggregations.totals.globalApprovalStatus.Approved),
                publication_points: formatLocaleNumber(aggregations.totals.points),
              }}
              components={{
                p: <Typography />,
                b: <Typography component="span" sx={{ fontWeight: 'bold' }} />,
                link: exportAcronym ? <ExportNviStatusLink acronym={exportAcronym} /> : <span />,
              }}
            />
          </HorizontalBox>
        )}
        {aggregationsQuery.isPending || nviStatusLastYearQuery.isPending ? (
          <Skeleton sx={{ width: { xs: '20rem', sm: '30rem' } }} />
        ) : aggregationsQuery.isError ||
          !aggregations ||
          nviStatusLastYearQuery.isError ||
          !aggregationsLastYear ? null : (
          <HorizontalBox>
            <Trans
              t={t}
              i18nKey="that_is_x_percent_of_the_number_reported_in_y"
              values={{
                percentage_compared_to_last_year:
                  percentageApprovedComparedToLastYear >= 0
                    ? formatLocaleNumber(Math.round(percentageApprovedComparedToLastYear))
                    : '-',
                last_year: lastYear,
              }}
              components={{
                p: <Typography />,
                bold: <Typography component="span" sx={{ fontWeight: 'bold' }} />,
              }}
            />
          </HorizontalBox>
        )}
      </VerticalBox>
    </ExpandableNviTopView>
  );
};
