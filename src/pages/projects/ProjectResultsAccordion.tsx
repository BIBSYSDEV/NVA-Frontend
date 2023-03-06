import { CircularProgress, TablePagination, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { LandingPageAccordion } from '../../components/landing_page/LandingPageAccordion';
import { RegistrationList } from '../../components/RegistrationList';
import { SearchResponse } from '../../types/common.types';
import { DescriptionFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { useFetch } from '../../utils/hooks/useFetch';

interface ProjectResultsProps {
  projectId: string;
}

const itemsPerRow = 5;

export const ProjectResultsAccordion = ({ projectId }: ProjectResultsProps) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const [results, isLoadingResults] = useFetch<SearchResponse<Registration>>({
    url: `${SearchApiPath.Registrations}?query=${
      DescriptionFieldNames.Projects
    }.id="${projectId}"&results=${itemsPerRow}&from=${page * itemsPerRow}`,
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
          <TablePagination
            rowsPerPageOptions={[itemsPerRow]}
            component="div"
            count={results.size}
            rowsPerPage={itemsPerRow}
            page={page}
            onPageChange={(_, muiPage) => setPage(muiPage)}
          />
        </>
      ) : (
        <Typography>{t('project.no_results')}</Typography>
      )}
    </LandingPageAccordion>
  );
};
