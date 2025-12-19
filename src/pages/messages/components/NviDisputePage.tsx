import { Grid, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { AreaOfResponsibilitySelector } from '../../../components/AreaOfResponsibiltySelector';
import { CuratorSelector } from '../../../components/CuratorSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { HeadTitle } from '../../../components/HeadTitle';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getDefaultNviYear, useNviDisputeParams } from '../../../utils/hooks/useNviCandidatesParams';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { ExcludeSubunitsCheckbox } from './ExcludeSubunitsCheckbox';
import { NviCandidateListItem } from './NviCandidateListItem';
import { NviSortSelector } from './NviSortSelector';
import { NviDisputeVisibilityFilter } from './NviDisputeVisibilityFilter';

export const NviDisputePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const nviDisputeParams = useNviDisputeParams();
  const nviCandidatesQuery = useFetchNviCandidates({ params: nviDisputeParams });
  const nviCandidatesQueryResults = nviCandidatesQuery.data?.hits ?? [];

  const page = Math.floor(nviDisputeParams.offset / nviDisputeParams.size) + 1;
  const year = getDefaultNviYear();
  const title = t('tasks.nvi.status_dispute_for', { year: year });

  return (
    <section>
      <HeadTitle>{title}</HeadTitle>
      <Typography variant="h1" sx={{ mb: '1.5rem' }}>
        {title}
      </Typography>

      <Grid container columns={16} spacing="1rem" sx={{ px: { xs: '0.5rem', md: 0 }, mb: '1rem' }}>
        <Grid size={12}>
          <SearchForm
            placeholder={t('tasks.search_placeholder')}
            paginationOffsetParamName={NviCandidatesSearchParam.Offset}
          />
        </Grid>
        <Grid size={4}>
          <NviDisputeVisibilityFilter />
        </Grid>
        <Grid size={{ xs: 16, sm: 8, md: 8, lg: 6 }}>
          <CuratorSelector
            selectedUsername={nviDisputeParams.assignee}
            onChange={(curator) => {
              const syncedParams = syncParamsWithSearchFields(searchParams);
              syncedParams.delete(NviCandidatesSearchParam.Offset);
              if (curator) {
                syncedParams.set(NviCandidatesSearchParam.Assignee, curator.username);
              } else {
                syncedParams.delete(NviCandidatesSearchParam.Assignee);
              }
              navigate({ search: syncedParams.toString() });
            }}
            roleFilter={[RoleName.NviCurator]}
          />
        </Grid>
        <Grid size={{ xs: 16, sm: 8, md: 8, lg: 6 }}>
          <AreaOfResponsibilitySelector
            paramName={NviCandidatesSearchParam.Affiliations}
            resetPagination={(params) => {
              params.delete(NviCandidatesSearchParam.Offset);
              if (!params.has(NviCandidatesSearchParam.Affiliations)) {
                params.delete(NviCandidatesSearchParam.ExcludeSubUnits);
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 16, sm: 16, md: 16, lg: 4 }}>
          <ExcludeSubunitsCheckbox
            paramName={NviCandidatesSearchParam.ExcludeSubUnits}
            paginationParamName={NviCandidatesSearchParam.Offset}
            disabled={!nviDisputeParams.affiliations?.length}
          />
        </Grid>
      </Grid>
      <ListPagination
        count={nviCandidatesQuery.data?.totalHits ?? 0}
        rowsPerPage={nviDisputeParams.size}
        page={page}
        onPageChange={(newPage) => {
          searchParams.set(NviCandidatesSearchParam.Offset, ((newPage - 1) * nviDisputeParams.size).toString());
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
              const currentOffset = (page - 1) * nviDisputeParams.size + index;
              return (
                <ErrorBoundary key={nviCandidate.identifier}>
                  <NviCandidateListItem
                    nviCandidate={nviCandidate}
                    currentOffset={currentOffset}
                    nviParams={nviDisputeParams}
                  />
                </ErrorBoundary>
              );
            })}
          </List>
        )}
      </ListPagination>
    </section>
  );
};
