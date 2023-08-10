import { CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { ListPagination } from '../../components/ListPagination';
import { RegistrationList } from '../../components/RegistrationList';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { SearchResponse } from '../../types/common.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';

interface ProjectResultsProps {
  projectId: string;
}

const itemsPerRowOptions = [5, 10];

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerRowOptions[0]);

  const [results, isLoadingResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=${
      DescriptionFieldNames.Projects
    }.id="${projectId}"&results=${rowsPerPage}&from=${(page - 1) * rowsPerPage}`,
    errorMessage: t('feedback.error.search'),
  });

  return (
    <LandingPageAccordion
      dataTestId={dataTestId.projectLandingPage.resultsAccordion}
      heading={results ? `${t('project.results')} (${results.size})` : t('project.results')}>
      {isLoadingResults ? (
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
