import { Typography } from '@mui/material';
import { ParseKeys } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { FetchResultsParams, ResultParam, ResultSearchOrder, SortOrder } from '../../../api/searchApi';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { nviApplicableTypes } from '../../../utils/registration-helpers';
import { ScientificValueLevels } from '../../search/advanced_search/ScientificValueFilter';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export type CorrectionListId =
  | 'ApplicableCategoriesWithNonApplicableChannel'
  | 'NonApplicableCategoriesWithApplicableChannel';

type CorrectionListSearchConfig = {
  [key in CorrectionListId]: {
    i18nKey: ParseKeys;
    queryParams: FetchResultsParams;
  };
};

const correctionListConfig: CorrectionListSearchConfig = {
  ApplicableCategoriesWithNonApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
    queryParams: {
      categoryShould: nviApplicableTypes,
      scientificValue: ScientificValueLevels.LevelZero,
    },
  },
  NonApplicableCategoriesWithApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel',
    queryParams: {
      categoryNot: nviApplicableTypes,
      scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
    },
  },
};

export const nviCorrectionListQueryKey = 'list';

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const listConfig = listId && correctionListConfig[listId];

  const fetchParams: FetchResultsParams = {
    ...listConfig?.queryParams,
    from: Number(searchParams.get(ResultParam.From) ?? 0),
    results: Number(searchParams.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    publicationYearSince: (new Date().getFullYear() - 1).toString(),
    order: searchParams.get(ResultParam.Order) as ResultSearchOrder | null,
    sort: searchParams.get(ResultParam.Sort) as SortOrder | null,
  };

  const registrationQuery = useRegistrationSearch({ enabled: !!listConfig, params: fetchParams });

  return (
    <section>
      <Helmet>
        <title>{t('tasks.correction_list')}</title>
      </Helmet>

      <Typography variant="h1" gutterBottom sx={{ mx: { xs: '0.25rem', md: 0 } }}>
        {listConfig ? t(listConfig.i18nKey) : t('tasks.nvi.correction_list_type.correction_list_duct')}
      </Typography>

      {listConfig ? (
        <RegistrationSearch registrationQuery={registrationQuery} />
      ) : (
        <iframe
          style={{ border: 'none', height: '80vh' }}
          title={t('tasks.nvi.correction_list_type.correction_list_duct')}
          width="100%"
          src="https://rapport-dv.uhad.no/t/DUCT/views/Ryddelister_2023/Rettelister2023?%3Aembed=y"
        />
      )}
    </section>
  );
};
