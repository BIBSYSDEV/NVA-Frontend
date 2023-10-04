import { List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { NviCandidateSearchResponse } from '../../../types/nvi.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { NviCandidateListItem } from './NviCandidateListItem';

interface NviCandidatesListProps {
  nviCandidatesQuery: UseQueryResult<NviCandidateSearchResponse, unknown>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  rowsPerPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  helmetTitle: string;
}

export const NviCandidatesList = ({
  nviCandidatesQuery,
  setRowsPerPage,
  rowsPerPage,
  setPage,
  page,
  helmetTitle,
}: NviCandidatesListProps) => {
  const { t } = useTranslation();

  return (
    <section>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>

      {nviCandidatesQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {nviCandidatesQuery.data?.hits.length === 0 ? (
            <Typography>{t('tasks.nvi.no_nvi_candidates')}</Typography>
          ) : (
            <>
              <List data-testid={dataTestId.tasksPage.nvi.candidatesList} disablePadding sx={{ mb: '0.5rem' }}>
                {nviCandidatesQuery.data?.hits.map((nviCandidate) => (
                  <ErrorBoundary key={nviCandidate.identifier}>
                    <NviCandidateListItem nviCandidate={nviCandidate} />
                  </ErrorBoundary>
                ))}
              </List>
              <ListPagination
                count={nviCandidatesQuery.data?.totalHits ?? 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(newRowsPerPage) => {
                  setRowsPerPage(newRowsPerPage);
                  setPage(1);
                }}
                maxHits={10_000}
              />
            </>
          )}
        </>
      )}
    </section>
  );
};
