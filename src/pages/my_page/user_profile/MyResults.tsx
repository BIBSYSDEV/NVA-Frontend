import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchPromotedPublicationsById } from '../../../api/preferencesApi';
import { fetchResults, FetchResultsParams } from '../../../api/searchApi';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SortSelectorWithoutParams } from '../../../components/SortSelectorWithoutParams';
import { RootState } from '../../../redux/store';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { RegistrationSearchResults } from '../../search/registration_search/RegistrationSearchResults';
import { registrationSortOptions } from '../../search/registration_search/RegistrationSortSelector';

export const MyResults = () => {
  const { t } = useTranslation();

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const [registrationSort, setRegistrationSort] = useState(registrationSortOptions[0]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const registrationsQueryConfig: FetchResultsParams = {
    contributor: personId,
    from: rowsPerPage * (page - 1),
    results: rowsPerPage,
    order: registrationSort.orderBy,
    sort: registrationSort.sortOrder,
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
      <Helmet>
        <title>{t('my_page.my_profile.my_research_results')}</title>
      </Helmet>
      <Typography variant="h2" gutterBottom>
        {t('my_page.my_profile.my_research_results')}
      </Typography>
      <ListPagination
        paginationAriaLabel={t('common.pagination_project_search')}
        count={registrationsQuery.data?.totalHits ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(1);
        }}
        sortingComponent={
          <SortSelectorWithoutParams
            options={registrationSortOptions}
            value={registrationSort}
            setValue={(value) => setRegistrationSort(value)}
          />
        }>
        {registrationsQuery.isPending ? (
          <ListSkeleton minWidth={100} height={100} />
        ) : registrationsQuery.data && registrationsQuery.data.totalHits > 0 ? (
          <RegistrationSearchResults
            canEditRegistration
            searchResult={registrationsQuery.data.hits}
            promotedPublications={promotedPublications}
          />
        ) : (
          <Typography>{t('common.no_hits')}</Typography>
        )}
      </ListPagination>
    </div>
  );
};
