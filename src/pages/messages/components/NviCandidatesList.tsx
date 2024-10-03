import { Box, List, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { AreaOfResponsibilitySelector } from '../../../components/AreaOfResponsibiltySelector';
import { CuratorSelector } from '../../../components/CuratorSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { NviCandidateSearchStatus } from '../../../types/nvi.types';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { NviCandidateListItem } from './NviCandidateListItem';
import { NviSortSelector } from './NviSortSelector';
import { NviYearSelector } from './NviYearSelector';

export const NviCandidatesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const nviParams = useNviCandidatesParams();

  const searchParams = new URLSearchParams(location.search);

  const nviCandidatesQuery = useFetchNviCandidates({ params: nviParams });

  const page = Math.floor(nviParams.offset / nviParams.size) + 1;

  return (
    <section>
      <Helmet>
        <title>{t('common.nvi')}</title>
      </Helmet>

      <Box
        sx={{
          mb: '1rem',
          mx: { xs: '0.5rem', md: 0 },
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
        <SearchForm placeholder={t('tasks.search_placeholder')} />

        <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <CuratorSelector
            selectedUsername={nviParams.assignee}
            onChange={(curator) => {
              const syncedParams = syncParamsWithSearchFields(searchParams);
              if (curator) {
                syncedParams.set(NviCandidatesSearchParam.Assignee, curator.username);
                if (nviParams.offset) {
                  syncedParams.delete(NviCandidatesSearchParam.Offset);
                }

                const currentStatusFilter = syncedParams.get(
                  NviCandidatesSearchParam.Filter
                ) as NviCandidateSearchStatus | null;
                if (
                  !currentStatusFilter ||
                  currentStatusFilter === 'pending' ||
                  currentStatusFilter === 'pendingCollaboration'
                ) {
                  syncedParams.set(NviCandidatesSearchParam.Filter, 'assigned' satisfies NviCandidateSearchStatus);
                }
              } else {
                syncedParams.delete(NviCandidatesSearchParam.Assignee);
              }
              navigate({ search: syncedParams.toString() });
            }}
            roleFilter={[RoleName.NviCurator]}
            sx={{ flex: '1 15rem' }}
          />

          <AreaOfResponsibilitySelector
            sx={{ flex: '1 15rem' }}
            paramName={NviCandidatesSearchParam.Affiliations}
            resetPagination={() => {
              if (nviParams.offset) {
                searchParams.delete(NviCandidatesSearchParam.Offset);
              }
            }}
          />

          <NviYearSelector sx={{ ml: 'auto' }} />
        </Box>
      </Box>

      {nviCandidatesQuery.isPending ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {nviCandidatesQuery.data?.hits.length === 0 ? (
            <Typography>{t('tasks.nvi.no_nvi_candidates')}</Typography>
          ) : (
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
              <List data-testid={dataTestId.tasksPage.nvi.candidatesList}>
                {nviCandidatesQuery.data?.hits.map((nviCandidate, index) => {
                  const currentOffset = (page - 1) * nviParams.size + index;
                  return (
                    <ErrorBoundary key={nviCandidate.identifier}>
                      <NviCandidateListItem nviCandidate={nviCandidate} currentOffset={currentOffset} />
                    </ErrorBoundary>
                  );
                })}
              </List>
            </ListPagination>
          )}
        </>
      )}
    </section>
  );
};
