import { Skeleton, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchNviInstitutionStatus } from '../api/hooks/useFetchNviStatus';
import { NviInstitutionStatusResponse } from '../types/nvi.types';
import { dataTestId } from '../utils/dataTestIds';
import { formatNumber } from '../utils/general-helpers';
import { getDefaultNviYear } from '../utils/hooks/useNviCandidatesParams';
import { ExpandableNviTopView } from './ExpandableNviTopView';
import { VerticalBox } from './styled/Wrappers';

interface Props {
  aggregations?: NviInstitutionStatusResponse;
}

export const NviPublicationPointsTexts = ({ aggregations }: Props) => {
  const { t } = useTranslation();
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
      {aggregations && aggregationsLastYear ? (
        <VerticalBox sx={{ gap: '0.25rem' }}>
          <Trans
            t={t}
            i18nKey="nvi_publication_points_page_numbers"
            values={{
              num_publications_approved_by_all: formatNumber(aggregations.totals.globalApprovalStatus.Approved),
              points_for_all_publications_approved_by_all: formatNumber(aggregations.totals.points),
              percentage_compared_to_last_year:
                percentageApprovedComparedToLastYear >= 0
                  ? formatNumber(Math.round(percentageApprovedComparedToLastYear))
                  : '-',
              last_year: lastYear,
            }}
            components={{
              box: <VerticalBox sx={{ mt: '1rem' }} />,
              p: <Typography sx={{ mb: '0.5rem' }} />,
              bold: <Typography component="span" sx={{ fontWeight: 'bold' }} />,
            }}
          />
        </VerticalBox>
      ) : (
        <VerticalBox sx={{ gap: '0.5rem', my: '1rem' }}>
          <Skeleton sx={{ width: { sm: '35rem', xs: '20rem' } }} />
          <Skeleton sx={{ width: { sm: '30rem', xs: '20rem' } }} />
        </VerticalBox>
      )}
    </ExpandableNviTopView>
  );
};
