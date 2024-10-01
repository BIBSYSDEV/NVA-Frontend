import { CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchRegistrationsForProject } from '../../api/hooks/useFetchRegistrationsForProject';
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

  const resultsQuery = useFetchRegistrationsForProject(projectId, rowsPerPage, page);
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
