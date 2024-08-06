import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { fetchResults, FetchResultsParams, ResultParam } from '../../../api/searchApi';
import { allPublicationInstanceTypes } from '../../../types/publicationFieldNames';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { nviApplicableTypes } from '../../../utils/registration-helpers';
import { ScientificValueLevels } from '../../search/advanced_search/ScientificValueFilter'; // TODO: circular dependancy
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export type CorrectionListId = '1' | '2';

type CorrectionListSearchConfig = {
  [key in CorrectionListId]: FetchResultsParams;
};

const searchConfig: CorrectionListSearchConfig = {
  '1': {
    categoryShould: nviApplicableTypes,
    scientificValue: ScientificValueLevels.LevelZero,
  },
  '2': {
    categoryShould: allPublicationInstanceTypes.filter((type) => !nviApplicableTypes.includes(type)),
    scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
  },
};

export const nviCorrectionListQueryKey = 'list';

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const listConfig = listId && searchConfig[listId];

  const fetchParams: FetchResultsParams = {
    ...listConfig,
    from: Number(searchParams.get(ResultParam.From) ?? 0),
    results: Number(searchParams.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
  };

  const registrationQuery = useQuery({
    enabled: !!listConfig,
    queryKey: ['registrations', fetchParams],
    queryFn: ({ signal }) => fetchResults(fetchParams, signal),
    meta: { errorMessage: t('feedback.error.search') },
  });

  if (!listConfig) {
    return (
      <iframe
        style={{ border: 'none', height: '80vh' }}
        title={t('tasks.correction_list')}
        width="100%"
        src="https://rapport-dv.uhad.no/t/DUCT/views/Ryddelister_2023/Rettelister2023?%3Aembed=y"
      />
    );
  }

  return <RegistrationSearch registrationQuery={registrationQuery} />;
};
