import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button, Grid, List, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
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
import { ExcludeSubunitsCheckbox } from './ExcludeSubunitsCheckbox';
import { NviCandidateListItem } from './NviCandidateListItem';
import { NviSortSelector } from './NviSortSelector';
import { NviStatusFilter, NviVisibilityFilter } from './NviStatusFilter';
import { NviYearSelector } from './NviYearSelector';

export const NviCandidatesList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nviParams = useNviCandidatesParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const nviCandidatesQuery = useFetchNviCandidates({ params: nviParams });
  const nviCandidatesQueryResults = nviCandidatesQuery.data?.hits ?? [];

  const page = Math.floor(nviParams.offset / nviParams.size) + 1;

  return (
    <section>
      <Helmet>
        <title>{t('tasks.nvi.nvi_control')}</title>
      </Helmet>
      <Typography component="h1" sx={visuallyHidden}>
        {t('tasks.nvi.nvi_control')}
      </Typography>

      <Grid container columns={16} spacing="1rem" sx={{ px: { xs: '0.5rem', md: 0 }, mb: '1rem' }}>
        <Grid size={{ xs: 16, md: 4 }}>
          <NviStatusFilter />
        </Grid>
        <Grid size={{ xs: 16, md: 12, lg: 8 }}>
          <SearchForm
            placeholder={t('tasks.search_placeholder')}
            paginationOffsetParamName={NviCandidatesSearchParam.Offset}
          />
        </Grid>
        <Grid size={{ xs: 16, sm: 8, md: 4 }}>
          <NviVisibilityFilter />
        </Grid>

        <Grid size={{ xs: 16, sm: 8, md: 6, lg: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            data-testid={dataTestId.tasksPage.nvi.excludeUnassignedButton}
            sx={{ textTransform: 'none' }}
            startIcon={!nviParams.excludeUnassigned ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            onClick={() => {
              setSearchParams((params) => {
                const syncedParams = syncParamsWithSearchFields(params);
                if (nviParams.excludeUnassigned) {
                  syncedParams.delete(NviCandidatesSearchParam.ExcludeUnassigned);
                } else {
                  syncedParams.set(NviCandidatesSearchParam.ExcludeUnassigned, 'true');
                }
                return syncedParams;
              });
            }}>
            {t('tasks.nvi.include_candidates_without_curator')}
          </Button>
        </Grid>

        <Grid size={{ xs: 16, sm: 6, lg: 4 }}>
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
          />
        </Grid>

        <Grid size={{ xs: 8, sm: 5, lg: 4 }}>
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

        <Grid size={{ xs: 8, sm: 5, lg: 2 }}>
          <ExcludeSubunitsCheckbox
            paramName={NviCandidatesSearchParam.ExcludeSubUnits}
            paginationParamName={NviCandidatesSearchParam.Offset}
            disabled={nviParams.affiliations === null || nviParams.affiliations.length === 0}
          />
        </Grid>

        <Grid size={{ xs: 16, md: 6, lg: 2 }}>
          <NviYearSelector fullWidth />
        </Grid>
      </Grid>

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
    </section>
  );
};
