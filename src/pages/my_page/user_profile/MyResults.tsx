import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchPromotedPublicationsById } from '../../../api/preferencesApi';
import { FetchResultsParams, fetchResults } from '../../../api/searchApi';
import { ListPagination } from '../../../components/ListPagination';
import { RootState } from '../../../redux/store';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { RegistrationSearchResults } from '../../search/registration_search/RegistrationSearchResults';

export const MyResults = () => {
  const { t } = useTranslation();

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const registrationsQueryConfig: FetchResultsParams = {
    contributor: personId,
    from: rowsPerPage * (page - 1),
    results: rowsPerPage,
  };
  const registrationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const promotedPublicationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['person-preferences', personId],
    queryFn: () => fetchPromotedPublicationsById(personId),
    meta: { errorMessage: false },
    retry: false,
  });

  const promotedPublications = promotedPublicationsQuery.data?.promotedPublications;

  return (
    <div>
      <Typography id="registration-label" variant="h2" gutterBottom>
        {t('my_page.my_profile.my_research_results')}
      </Typography>
      {registrationsQuery.isPending ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress aria-labelledby="registration-label" />
        </Box>
      ) : registrationsQuery.data && registrationsQuery.data.totalHits > 0 ? (
        <ListPagination
          count={registrationsQuery.data.totalHits}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <RegistrationSearchResults
            canEditRegistration={true}
            searchResult={registrationsQuery.data.hits}
            promotedPublications={promotedPublications}
          />
        </ListPagination>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </div>
  );
};
