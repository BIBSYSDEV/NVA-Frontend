import { useTranslation } from 'react-i18next';
import { SearchResponse } from '../../types/common.types';
import { NfrProject } from '../../types/project.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { VerifiedFundingApiPath } from '../apiPaths';

export const useNfrProjectSearch = (searchTerm: string) => {
  const { t } = useTranslation();

  return useFetch<SearchResponse<NfrProject>>({
    url: searchTerm ? `${VerifiedFundingApiPath.Nfr}?term=${searchTerm}&size=20` : '',
    errorMessage: t('feedback.error.search'),
  });
};
