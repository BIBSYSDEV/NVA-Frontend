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
import { NviCandidateSearchResponse } from '../../../types/nvi.types';
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

      <Box sx={{ mb: '1rem', mx: { xs: '0.5rem', md: 0, display: 'flex', flexDirection: 'column', gap: '1rem' } }}>
        <SearchForm placeholder={t('tasks.search_placeholder')} />

        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <CuratorSelector roleFilter={[RoleName.NviCurator]} sx={{ flex: '0 20rem' }} />
          <Select
            size="small"
            inputProps={{ 'aria-label': t('common.year') }}
            value={nviYearFilter}
            onChange={(event) => {
              searchParams.set(NviCandidatesSearchParam.Year, event.target.value.toString());
              history.push({ search: searchParams.toString() });
            }}
            sx={{ ml: 'auto' }}>
            {nviYearFilterValues.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
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
