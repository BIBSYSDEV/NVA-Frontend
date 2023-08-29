import { List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ListPagination } from '../../components/ListPagination';
import { ListSkeleton } from '../../components/ListSkeleton';
import { SearchListItem } from '../../components/styled/Wrappers';
import { SearchResponse } from '../../types/common.types';

interface NviCandidatesListProps {
  nviCandidatesQuery: UseQueryResult<SearchResponse<any>, unknown>;
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
  const nviCandidates = nviCandidatesQuery.data?.hits ?? [];

  return (
    <section>
      <Helmet>
        <title>{helmetTitle}</title>
      </Helmet>

      {nviCandidatesQuery.isLoading ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : (
        <>
          {nviCandidates.length === 0 ? (
            <Typography>{t('my_page.messages.no_messages')}</Typography>
          ) : (
            <>
              <List disablePadding sx={{ mb: '0.5rem' }}>
                {nviCandidates.map((nviCandidate) => (
                  <ErrorBoundary key={nviCandidate.id}>
                    <SearchListItem sx={{ borderLeftColor: '#ee95ea' }}>
                      <p>{nviCandidate.publicationDetails.title}</p>
                    </SearchListItem>
                  </ErrorBoundary>
                ))}
              </List>
              <ListPagination
                count={nviCandidatesQuery.data?.size ?? 0}
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
