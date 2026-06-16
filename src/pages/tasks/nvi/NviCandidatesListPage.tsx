import { List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchNviPeriodReport } from '../../../api/hooks/useFetchNviPeriodReport';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { InfoBannerSize, InfoBannerType } from '../../../components/info-banner/enums';
import { InfoBanner } from '../../../components/info-banner/InfoBanner';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { MainContentLayout } from '../../../components/page-layouts/MainContentLayout';
import { NviPeriodStatusEnum } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { toDateString } from '../../../utils/date-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviPeriodStatus } from '../../basic-data/nvi/reporting-periods/_utils/nvi-period-helpers';
import { NviCandidateListItem } from '../../messages/components/NviCandidateListItem';
import { NviSortSelector } from '../../messages/components/NviSortSelector';
import { NviCandidatesSearchFilters } from './_components/nvi-candidates-search-filters/NviCandidatesSearchFilters';

const NviCandidatesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nviParams = useNviCandidatesParams();

  const { data: periodData } = useFetchNviPeriodReport({ year: nviParams.year });
  const periodStatus = periodData?.period ? getNviPeriodStatus(periodData.period) : null;
  const periodIsClosed = periodStatus === NviPeriodStatusEnum.ClosedPeriod;
  const periodIsUnopened = periodStatus === NviPeriodStatusEnum.UnopenedPeriod;
  const openingDate = periodData?.period?.startDate ? toDateString(periodData.period.startDate) : '';
  const infoBannerText = periodIsClosed
    ? t('nvi_period_for_year_is_closed', { year: nviParams.year })
    : periodIsUnopened
      ? t('nvi_period_for_year_is_unopened', { year: nviParams.year, date: openingDate })
      : null;

  const nviCandidatesQuery = useFetchNviCandidates({ params: nviParams });
  const nviCandidatesQueryResults = nviCandidatesQuery.data?.hits ?? [];

  const page = Math.floor(nviParams.offset / nviParams.size) + 1;

  return (
    <MainContentLayout heading={t('candidate_search')} headTitle={t('candidate_search')} sx={{ gap: '0.1rem' }}>
      <>
        {infoBannerText && (
          <InfoBanner text={infoBannerText} size={InfoBannerSize.MEDIUM} type={InfoBannerType.LOCK} noElevation />
        )}
        <NviCandidatesSearchFilters />
        <ListPagination
          count={nviCandidatesQuery.data?.totalHits ?? 0}
          rowsPerPage={nviParams.size}
          page={page}
          onPageChange={(newPage) => {
            searchParams.set(NviCandidatesSearchParam.Offset, ((newPage - 1) * nviParams.size).toString());
            navigate({ search: searchParams.toString() });
          }}
          onRowsPerPageChange={(newRowsPerPage) => {
            searchParams.set(NviCandidatesSearchParam.Size, newRowsPerPage.toString());
            searchParams.delete(NviCandidatesSearchParam.Offset);
            navigate({ search: searchParams.toString() });
          }}
          maxHits={10_000}
          showPaginationTop
          sortingComponent={<NviSortSelector />}>
          {nviCandidatesQuery.isPending ? (
            <ListSkeleton minWidth={100} maxWidth={100} height={100} />
          ) : nviCandidatesQueryResults.length === 0 ? (
            <Typography sx={{ mx: { xs: '0.5rem', md: 0 } }}>{t('tasks.nvi.no_nvi_candidates')}</Typography>
          ) : (
            <List data-testid={dataTestId.tasksPage.nvi.candidatesList}>
              {nviCandidatesQueryResults.map((nviCandidate, index) => {
                const currentOffset = (page - 1) * nviParams.size + index;
                return (
                  <ErrorBoundary key={nviCandidate.identifier}>
                    <NviCandidateListItem nviCandidate={nviCandidate} currentOffset={currentOffset} />
                  </ErrorBoundary>
                );
              })}
            </List>
          )}
        </ListPagination>
      </>
    </MainContentLayout>
  );
};

export default NviCandidatesListPage;
