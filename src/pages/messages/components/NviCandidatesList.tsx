import { Box, List, MenuItem, Select, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { FetchNviCandidatesParams, NviCandidatesSearchParam } from '../../../api/searchApi';
import { CuratorSelector } from '../../../components/CuratorSelector';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchForm } from '../../../components/SearchForm';
import { NviCandidateSearchResponse, NviCandidateSearchStatus } from '../../../types/nvi.types';
import { RoleName } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';
import { NviCandidateListItem } from './NviCandidateListItem';

interface NviCandidatesListProps {
  nviCandidatesQuery: UseQueryResult<NviCandidateSearchResponse, unknown>;
  nviQueryParams: FetchNviCandidatesParams;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  helmetTitle: string;
}

const nviYearFilterValues = getNviYearFilterValues();

export const NviCandidatesList = ({
  nviCandidatesQuery,
  nviQueryParams,
  setRowsPerPage,
  rowsPerPage,
  setPage,
  page,
  helmetTitle,
}: NviCandidatesListProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);

  const nviYearParam = searchParams.get(NviCandidatesSearchParam.Year);
  const nviYearFilter = nviYearParam ? +nviYearParam : nviYearFilterValues[1];

  return (
    <section>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>

      <Box
        sx={{
          mb: '1rem',
          mx: { xs: '0.5rem', md: 0 },
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
        }}>
        <SearchForm placeholder={t('tasks.search_placeholder')} sx={{ gridColumn: '1/3' }} />

        <CuratorSelector
          selectedUsername={searchParams.get(NviCandidatesSearchParam.Assignee)}
          onChange={(curator) => {
            if (curator) {
              searchParams.set(NviCandidatesSearchParam.Assignee, curator.username);

              const currentStatusFilter = searchParams.get(
                NviCandidatesSearchParam.Filter
              ) as NviCandidateSearchStatus | null;
              if (
                !currentStatusFilter ||
                currentStatusFilter === 'pending' ||
                currentStatusFilter === 'pendingCollaboration'
              ) {
                searchParams.set(NviCandidatesSearchParam.Filter, 'assigned' satisfies NviCandidateSearchStatus);
              }
            } else {
              searchParams.delete(NviCandidatesSearchParam.Assignee);
            }
            history.push({ search: searchParams.toString() });
          }}
          roleFilter={[RoleName.NviCurator]}
          sx={{ maxWidth: '20rem' }}
        />
        <Select
          data-testid={dataTestId.tasksPage.nvi.yearSelect}
          size="small"
          inputProps={{ 'aria-label': t('common.year') }}
          value={nviYearFilter}
          onChange={(event) => {
            searchParams.set(NviCandidatesSearchParam.Year, event.target.value.toString());
            history.push({ search: searchParams.toString() });
          }}>
          {nviYearFilterValues.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
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
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(1);
              }}
              maxHits={10_000}>
              <List data-testid={dataTestId.tasksPage.nvi.candidatesList} disablePadding sx={{ mb: '0.5rem' }}>
                {nviCandidatesQuery.data?.hits.map((nviCandidate, index) => {
                  const currentOffset = (page - 1) * rowsPerPage + index;
                  return (
                    <ErrorBoundary key={nviCandidate.identifier}>
                      <NviCandidateListItem
                        nviCandidate={nviCandidate}
                        nviQueryParams={nviQueryParams}
                        currentOffset={currentOffset}
                      />
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
