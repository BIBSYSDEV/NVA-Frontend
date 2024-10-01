import { Box, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchRegistrationsForProject } from '../../../api/hooks/useFetchRegistrationsForProject';
import { ListPagination } from '../../../components/ListPagination';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { CristinProject } from '../../../types/project.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';

export const RelatedRegistrationsField = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<CristinProject>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const resultsQuery = useFetchRegistrationsForProject(values.id, rowsPerPage, page);
  const results = resultsQuery.data;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h2">{t('project.form.related_registrations')}</Typography>
      <Typography>{t('project.form.related_registrations_description')}</Typography>
      {resultsQuery.isPending ? (
        <Box>
          <ListSkeleton arrayLength={4} maxWidth={60} height={20} />
        </Box>
      ) : results && results.totalHits > 0 ? (
        <ListPagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          count={results.totalHits}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: 0 }} component={'ul'}>
            {results.hits.map((relatedRegistration) => (
              <SearchListItem sx={{ borderLeftColor: 'registration.main' }} key={relatedRegistration.id}>
                <RegistrationListItemContent registration={relatedRegistration} />
              </SearchListItem>
            ))}
          </Box>
        </ListPagination>
      ) : (
        <Typography>{t('project.no_results')}</Typography>
      )}
    </Box>
  );
};
