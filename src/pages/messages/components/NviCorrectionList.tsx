import { Box, Divider, Typography } from '@mui/material';
import { ParseKeys } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { FetchResultsParams, ResultParam, ResultSearchOrder, SortOrder } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { BookType } from '../../../types/publicationFieldNames';
import { PublicationInstanceType } from '../../../types/registration.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { nviApplicableTypes } from '../../../utils/registration-helpers';
import { JournalFilter } from '../../search/advanced_search/JournalFilter';
import { OrganizationFilters } from '../../search/advanced_search/OrganizationFilters';
import { PublisherFilter } from '../../search/advanced_search/PublisherFilter';
import { ScientificValueLevels } from '../../search/advanced_search/ScientificValueFilter';
import { SeriesFilter } from '../../search/advanced_search/SeriesFilter';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export type CorrectionListId =
  | 'ApplicableCategoriesWithNonApplicableChannel'
  | 'NonApplicableCategoriesWithApplicableChannel'
  | 'AntologyWithoutChapter'
  | 'BooksWithLessThan50Pages';

type CorrectionListSearchConfig = {
  [key in CorrectionListId]: {
    i18nKey: ParseKeys;
    queryParams: FetchResultsParams;
    disabledFilters: ResultParam[];
  };
};

const correctionListConfig: CorrectionListSearchConfig = {
  ApplicableCategoriesWithNonApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
    queryParams: {
      categoryShould: nviApplicableTypes,
      scientificValue: ScientificValueLevels.LevelZero,
    },
    disabledFilters: [ResultParam.CategoryShould],
  },
  NonApplicableCategoriesWithApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel',
    queryParams: {
      categoryNot: nviApplicableTypes,
      scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
    },
    disabledFilters: [ResultParam.CategoryShould],
  },
  AntologyWithoutChapter: {
    i18nKey: 'tasks.nvi.correction_list_type.antology_without_chapter',
    queryParams: {
      categoryShould: [BookType.Anthology],
      hasNoChildren: false,
    },
    disabledFilters: [ResultParam.CategoryShould],
  },
  BooksWithLessThan50Pages: {
    i18nKey: 'tasks.nvi.correction_list_type.book_with_less_than_50_pages',
    queryParams: {
      categoryShould: Object.values(BookType),
      publicationPages: '0,50',
    },
    disabledFilters: [],
  },
};

export const nviCorrectionListQueryKey = 'list';

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const listConfig = listId && correctionListConfig[listId];

  const categoryShould =
    (searchParams.get(ResultParam.CategoryShould)?.split(',') as PublicationInstanceType[] | null) ?? [];
  const topLevelOrganizationId = searchParams.get(ResultParam.TopLevelOrganization);
  const unitId = searchParams.get(ResultParam.Unit);
  const excludeSubunits = searchParams.get(ResultParam.ExcludeSubunits) === 'true';

  const fetchParams: FetchResultsParams = {
    categoryShould,
    excludeSubunits,
    from: Number(searchParams.get(ResultParam.From) ?? 0),
    journal: searchParams.get(ResultParam.Journal),
    results: Number(searchParams.get(ResultParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]),
    publicationYearSince: (new Date().getFullYear() - 1).toString(),
    publisher: searchParams.get(ResultParam.Publisher),
    order: searchParams.get(ResultParam.Order) as ResultSearchOrder | null,
    series: searchParams.get(ResultParam.Series),
    sort: searchParams.get(ResultParam.Sort) as SortOrder | null,
    unit: unitId ?? topLevelOrganizationId,
    ...listConfig?.queryParams,
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
        <>
          <Box
            sx={{ px: { xs: '0.5rem', md: 0 }, display: 'flex', flexDirection: 'column', gap: '0.5rem', mb: '1rem' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <OrganizationFilters topLevelOrganizationId={topLevelOrganizationId} unitId={unitId} />
              <Divider flexItem orientation="vertical" sx={{ bgcolor: 'primary.main' }} />
              <CategorySearchFilter
                searchParam={ResultParam.CategoryShould}
                disabled={listConfig.disabledFilters.includes(ResultParam.CategoryShould)}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
              <PublisherFilter />
              <JournalFilter />
              <SeriesFilter />
            </Box>
          </Box>

          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
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
