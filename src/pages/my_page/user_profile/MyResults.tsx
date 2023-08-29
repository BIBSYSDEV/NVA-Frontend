import { Box, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchPromotedPublicationsById } from '../../../api/preferencesApi';
import { ListPagination } from '../../../components/ListPagination';
import { RootState } from '../../../redux/store';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { useSearchRegistrations } from '../../../utils/hooks/useSearchRegistrations';
import { ExpressionStatement } from '../../../utils/searchHelpers';
import { RegistrationSearchResults } from '../../search/registration_search/RegistrationSearchResults';

export const MyResults = () => {
  const { t } = useTranslation();

  const personId = useSelector((store: RootState) => store.user?.cristinId) ?? '';

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const [registrations, isLoadingRegistrations] = useSearchRegistrations(
    {
      properties: [
        {
          fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
          value: personId,
          operator: ExpressionStatement.Contains,
        },
      ],
    },
    rowsPerPage,
    rowsPerPage * (page - 1)
  );

  const promotedPublicationsQuery = useQuery({
    queryKey: ['person-preferences', personId],
    queryFn: () => fetchPromotedPublicationsById(personId),
    meta: { errorMessage: false },
    retry: false,
  });

  const promotedPublications = promotedPublicationsQuery.data?.promotedPublications ?? [];

  return (
    <div>
      <Typography id="registration-label" variant="h2" gutterBottom>
        {t('my_page.my_profile.my_research_results')}
      </Typography>
      {isLoadingRegistrations ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress aria-labelledby="registration-label" />
        </Box>
      ) : registrations && registrations.size > 0 ? (
        <>
          <RegistrationSearchResults
            canEditRegistration={true}
            searchResult={registrations}
            promotedPublications={promotedPublications}
            personId={personId}
          />
          <ListPagination
            count={registrations.size}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRowsPerPage(newRowsPerPage);
              setPage(1);
            }}
          />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </div>
  );
};
