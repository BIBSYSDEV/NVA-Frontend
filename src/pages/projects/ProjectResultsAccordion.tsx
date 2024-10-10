import { CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults, FetchResultsParams } from '../../api/searchApi';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { ListPagination } from '../../components/ListPagination';
import { RegistrationList } from '../../components/RegistrationList';
import { dataTestId } from '../../utils/dataTestIds';

interface ProjectResultsProps {
  projectId: string;
}

const itemsPerRowOptions = [5, 10];

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerRowOptions[0]);

  const registrationsQueryConfig: FetchResultsParams = {
    project: projectId,
    from: rowsPerPage * (page - 1),
    results: rowsPerPage,
  };
  const resultsQuery = useQuery({
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.search') },
  });
  const results = resultsQuery.data;

  return (
    <LandingPageAccordion
      dataTestId={dataTestId.projectLandingPage.resultsAccordion}
      heading={results ? `${t('project.results')} (${results.totalHits})` : t('project.results')}>
      {resultsQuery.isPending ? (
        <CircularProgress aria-label={t('project.results')} />
      ) : results && results.totalHits > 0 ? (
        <ListPagination
          rowsPerPageOptions={itemsPerRowOptions}
          count={results.totalHits}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}>
          <RegistrationList registrations={results.hits} />
        </ListPagination>
      ) : (
        <Typography>{t('project.no_results')}</Typography>
      )}
    </LandingPageAccordion>
  );
};
