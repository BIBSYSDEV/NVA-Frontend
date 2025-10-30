import { Box, Divider, MenuItem, TextField, Typography } from '@mui/material';
import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useRegistrationSearch } from '../../../api/hooks/useRegistrationSearch';
import { FetchResultsParams, NviCandidatesSearchParam, ResultParam } from '../../../api/searchApi';
import { CategorySearchFilter } from '../../../components/CategorySearchFilter';
import { HeadTitle } from '../../../components/HeadTitle';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { BookType } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { useRegistrationsQueryParams } from '../../../utils/hooks/useRegistrationSearchParams';
import { getNviYearFilterValues } from '../../../utils/nviHelpers';
import { nviApplicableTypes } from '../../../utils/registration-helpers';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { JournalFilter } from '../../search/advanced_search/JournalFilter';
import { OrganizationFilters } from '../../search/advanced_search/OrganizationFilters';
import { PublisherFilter } from '../../search/advanced_search/PublisherFilter';
import { ScientificValueLevels } from '../../search/advanced_search/ScientificValueFilter';
import { SeriesFilter } from '../../search/advanced_search/SeriesFilter';
import { RegistrationSearch } from '../../search/registration_search/RegistrationSearch';

export type CorrectionListId =
  | 'ApplicableCategoriesWithNonApplicableChannel'
  | 'NonApplicableCategoriesWithApplicableChannel'
  | 'AnthologyWithoutChapter'
  | 'AnthologyWithApplicableChapter'
  | 'BooksWithLessThan50Pages'
  | 'UnidentifiedContributorWithIdentifiedAffiliation';

type CorrectionListSearchConfig = {
  [key in CorrectionListId]: {
    i18nKey: ParseKeys;
    queryParams: FetchResultsParams;
    disabledFilters: ResultParam[];
  };
};

export const correctionListConfig: CorrectionListSearchConfig = {
  ApplicableCategoriesWithNonApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
    queryParams: {
      categoryShould: nviApplicableTypes,
      allScientificValues: ScientificValueLevels.LevelZero,
    },
    disabledFilters: [],
  },
  NonApplicableCategoriesWithApplicableChannel: {
    i18nKey: 'tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel',
    queryParams: {
      categoryNot: nviApplicableTypes,
      scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
    },
    disabledFilters: [ResultParam.CategoryShould],
  },
  AnthologyWithoutChapter: {
    i18nKey: 'tasks.nvi.correction_list_type.anthology_without_chapter',
    queryParams: {
      categoryShould: [BookType.Anthology],
      hasNoChildren: false,
    },
    disabledFilters: [],
  },
  BooksWithLessThan50Pages: {
    i18nKey: 'tasks.nvi.correction_list_type.book_with_less_than_50_pages',
    queryParams: {
      categoryShould: Object.values(BookType),
      publicationPages: '0,50',
    },
    disabledFilters: [],
  },
  AnthologyWithApplicableChapter: {
    i18nKey: 'tasks.nvi.correction_list_type.anthology_with_applicable_chapter',
    queryParams: {
      categoryShould: [BookType.Anthology],
      hasChildren: true,
      scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
    },
    disabledFilters: [],
  },
  UnidentifiedContributorWithIdentifiedAffiliation: {
    i18nKey: 'tasks.nvi.correction_list_type.unidentified_contributor_with_identified_affiliation',
    queryParams: {
      unidentifiedNorwegian: true,
      categoryShould: nviApplicableTypes,
    },
    disabledFilters: [],
  },
};

export const nviCorrectionListQueryKey = 'list';
const nviYearFilterValues = getNviYearFilterValues(new Date().getFullYear() + 1);

export const NviCorrectionList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const listId = searchParams.get(nviCorrectionListQueryKey) as CorrectionListId | null;
  const listConfig = listId && correctionListConfig[listId];

  const registrationParams = useRegistrationsQueryParams();
  const { year, offset } = useNviCandidatesParams();

  const registrationQuery = useRegistrationSearch({
    enabled: !!listConfig,
    params: {
      ...listConfig?.queryParams,
      ...registrationParams,
      publicationYear: year.toString(),
      unit: registrationParams.unit ?? registrationParams.topLevelOrganization,
    },
  });

  return (
    <section>
      <HeadTitle>{t('tasks.correction_list')}</HeadTitle>

      {listConfig && (
        <>
          <Typography variant="h1" gutterBottom sx={{ mx: { xs: '0.25rem', md: 0 } }}>
            {t(listConfig.i18nKey)}
          </Typography>

          <Box
            sx={{ px: { xs: '0.5rem', md: 0 }, display: 'flex', flexDirection: 'column', gap: '0.5rem', mb: '1rem' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <OrganizationFilters
                topLevelOrganizationId={registrationParams.topLevelOrganization ?? null}
                unitId={registrationParams.unit ?? null}
              />
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
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'primary.main' }} />
              <Box>
                <StyledFilterHeading>{t('registration.year_published')}</StyledFilterHeading>
                <TextField
                  sx={{ minWidth: '6rem' }}
                  select
                  data-testid={dataTestId.tasksPage.nvi.yearSelect}
                  size="small"
                  value={year}
                  slotProps={{
                    htmlInput: {
                      'aria-label': t('registration.year_published'),
                    },
                  }}
                  onChange={(event) => {
                    const selectedYear = +event.target.value;
                    const syncedParams = syncParamsWithSearchFields(searchParams);
                    syncedParams.set(NviCandidatesSearchParam.Year, selectedYear.toString());
                    if (offset) {
                      syncedParams.delete(NviCandidatesSearchParam.Offset);
                    }
                    navigate({ search: syncedParams.toString() });
                  }}>
                  {nviYearFilterValues.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>{' '}
            </Box>
          </Box>

          <RegistrationSearch registrationQuery={registrationQuery} />
        </>
      )}
    </section>
  );
};
