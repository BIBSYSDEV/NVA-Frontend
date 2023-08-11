import { CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResults } from '../../api/searchApi';
import { ListPagination } from '../../components/ListPagination';
import { RegistrationList } from '../../components/RegistrationList';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { dataTestId } from '../../utils/dataTestIds';

interface ProjectResultsProps {
  projectId: string;
}

const itemsPerRowOptions = [5, 10];

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerRowOptions[0]);

  const resultsQuery = useQuery({
    queryKey: ['projectResults', projectId, rowsPerPage, page],
    queryFn: () =>
      fetchResults(rowsPerPage, (page - 1) * rowsPerPage, `${DescriptionFieldNames.Projects}.id:"${projectId}"`),
    meta: { errorMessage: t('feedback.error.search') },
  });
  const results = resultsQuery.data;

  return (
    <LandingPageAccordion
      dataTestId={dataTestId.projectLandingPage.resultsAccordion}
      heading={results ? `${t('project.results')} (${results.size})` : t('project.results')}>
      {resultsQuery.isLoading ? (
        <CircularProgress aria-label={t('project.results')} />
      ) : results && results.size > 0 ? (
        <>
          <RegistrationList registrations={results.hits} />
          <ListPagination
            rowsPerPageOptions={itemsPerRowOptions}
            count={results.size}
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
        <Typography>{t('project.no_results')}</Typography>
      )}
    </LandingPageAccordion>
  );
};
