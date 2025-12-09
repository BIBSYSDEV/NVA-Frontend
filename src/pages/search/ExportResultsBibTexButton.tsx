import { fetchResults, FetchResultsParams, ResultParam } from '../../api/searchApi';
import { PublicationInstanceType } from '../../types/registration.types';
import { exportToBibTex } from '../../utils/bibtex/BibTexFactory';
import { dataTestId } from '../../utils/dataTestIds';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface ExportResultsBibTexButtonProps {
  searchParams: URLSearchParams;
}

export const ExportResultsBibTexButton = ({ searchParams }: ExportResultsBibTexButtonProps) => {
  const { t } = useTranslation();
  const maxNumberOfCitations = 500;

  const registrationsQueryConfig: FetchResultsParams = {
    query: searchParams.get(ResultParam.Query),
    category: searchParams.get(ResultParam.Category) as PublicationInstanceType | null,
    topLevelOrganization: searchParams.get(ResultParam.TopLevelOrganization),
    contributor: searchParams.get(ResultParam.Contributor),
    fundingSource: searchParams.get(ResultParam.FundingSource),
    publisher: searchParams.get(ResultParam.Publisher),
    series: searchParams.get(ResultParam.Series),
    journal: searchParams.get(ResultParam.Journal),
    files: searchParams.get(ResultParam.Files),
    publicationYear: searchParams.get(ResultParam.PublicationYear),
    publicationYearBefore: searchParams.get(ResultParam.PublicationYearBefore),
    publicationYearSince: searchParams.get(ResultParam.PublicationYearSince),
    from: 0,
    results: maxNumberOfCitations,
  };

  const registrationsQuery = useQuery({
    enabled: false,
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: async () => {
      return await fetchResults(registrationsQueryConfig);
    },
    meta: { errorMessage: t('feedback.error.search') },
  });

  const exportBibTex = async () => {
    const { data } = await registrationsQuery.refetch();
    if (data !== undefined) {
      exportToBibTex(data.hits, data.totalHits);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{ ml: '1em' }}
      color="tertiary"
      onClick={exportBibTex}
      title={'Export BibTex'}
      data-testid={dataTestId.startPage.advancedSearch.downloadBibTexButton}
      disabled={registrationsQuery.isFetching}>
      <FormatBoldIcon />
    </Button>
  );
};
