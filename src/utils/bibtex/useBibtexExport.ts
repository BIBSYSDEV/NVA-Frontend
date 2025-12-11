import { useSearchParams } from 'react-router';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { FetchResultsParams, ResultParam } from '../../api/searchApi';
import { PublicationInstanceType } from '../../types/registration.types';
import { exportToBibTex } from './BibTexFactory';

export const useBibtexExport = () => {
  const [searchParams] = useSearchParams();
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

  const registrationsQuery = useRegistrationSearch({
    params: registrationsQueryConfig,
  });

  const exportBibTex = async () => {
    const { data } = await registrationsQuery.refetch();
    if (!!data) {
      exportToBibTex(data.hits, data.totalHits);
    }
  };

  return exportBibTex;
};
