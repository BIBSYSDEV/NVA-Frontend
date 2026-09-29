import { afterEach, describe, expect, test, vi } from 'vitest';
import { ResultParam } from '../../api/searchApi';
import { ScientificValueLevels } from '../../pages/search/advanced_search/ScientificValueFilter';
import {
  CommonCorrectionListConfig,
  CorrectionListNames,
  CorrectionListSearchConfig,
  nviCorrectionListQueryKey,
} from '../../types/nvi.types';
import { BookType, ChapterType } from '../../types/publicationFieldNames';
import {
  getAccordionDefaultPath,
  getCommonCorrectionListConfig,
  getCorrectionListSearchParams,
  isCorrectionListName,
} from '../correctionListHelpers';
import { UrlPathTemplate } from '../urlPaths';

const commonConfig: CommonCorrectionListConfig = { publicationYear: '2026' };

/**
 * Creates a config where every list has no filters, so that each test can give a single list only
 * the filters it needs to verify.
 */
const buildConfig = (overrides: Partial<CorrectionListSearchConfig> = {}): CorrectionListSearchConfig => {
  const emptyConfig = Object.values(CorrectionListNames).reduce((config, listId) => {
    config[listId] = {
      i18nKey: 'tasks.correction_list',
      queryParams: {},
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: false,
      topLevelOrganization: undefined,
    };
    return config;
  }, {} as CorrectionListSearchConfig);

  return { ...emptyConfig, ...overrides };
};

/** Creates a config where a single list has the given filters, and every other list has none. */
const buildConfigForList = (
  listId: CorrectionListNames,
  queryParams: CorrectionListSearchConfig[CorrectionListNames]['queryParams'],
  topLevelOrganization?: string
) =>
  buildConfig({
    [listId]: {
      i18nKey: 'tasks.correction_list',
      queryParams,
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: false,
      topLevelOrganization,
    },
  });

describe('getCommonCorrectionListConfig', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test('should default the publication year to the current NVI year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-01T12:00:00'));

    expect(getCommonCorrectionListConfig()).toEqual({ publicationYear: '2026' });
  });

  test('should default the publication year to the previous year before May, while that year is still being reported', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-30T12:00:00'));

    expect(getCommonCorrectionListConfig()).toEqual({ publicationYear: '2025' });
  });
});

describe('getCorrectionListSearchParams', () => {
  test('should set the given list id, so the page knows which list to show', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.get(nviCorrectionListQueryKey)).toBe(CorrectionListNames.AnthologyWithoutChapter);
  });

  test('should set the publication year from the common config', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.get(ResultParam.PublicationYear)).toBe(commonConfig.publicationYear);
  });

  test('should set only the list id and publication year when the list has no filters', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect([...searchParams.keys()]).toEqual([nviCorrectionListQueryKey, ResultParam.PublicationYear]);
  });

  test('should set the configured categories as a comma separated list', () => {
    const config = buildConfigForList(CorrectionListNames.AnthologyWithoutChapter, {
      categoryShould: [BookType.Anthology, ChapterType.AcademicChapter],
    });

    const searchParams = getCorrectionListSearchParams(
      config,
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.get(ResultParam.CategoryShould)).toBe(`${BookType.Anthology},${ChapterType.AcademicChapter}`);
  });

  test('should not set categories when the configured list of categories is empty', () => {
    const config = buildConfigForList(CorrectionListNames.AnthologyWithoutChapter, { categoryShould: [] });

    const searchParams = getCorrectionListSearchParams(
      config,
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.has(ResultParam.CategoryShould)).toBe(false);
  });

  test('should set the configured top level organization and scientific value', () => {
    const config = buildConfigForList(
      CorrectionListNames.AnthologyWithoutChapter,
      { scientificValue: ScientificValueLevels.LevelOne },
      'organization/1.0'
    );

    const searchParams = getCorrectionListSearchParams(
      config,
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.get(ResultParam.TopLevelOrganization)).toBe('organization/1.0');
    expect(searchParams.get(ResultParam.ScientificValue)).toBe(ScientificValueLevels.LevelOne);
  });

  test('should set the configured institution for unidentified contributors', () => {
    const config = buildConfigForList(CorrectionListNames.UnidentifiedContributorWithIdentifiedAffiliation, {
      unidentifiedContributorInstitution: '/organization/1.0',
    });

    const searchParams = getCorrectionListSearchParams(
      config,
      CorrectionListNames.UnidentifiedContributorWithIdentifiedAffiliation,
      commonConfig
    );

    expect(searchParams.get(ResultParam.UnidentifiedContributorInstitution)).toBe('/organization/1.0');
  });

  // The two years being equal is what makes the search compare them, so they must never drift apart
  test('should exclude the same year as the publication year for the chapter and book year mismatch list', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.YearBetweenChapterAndBookMismatch,
      commonConfig
    );

    expect(searchParams.get(ResultParam.ExcludeParentPublicationYear)).toBe(commonConfig.publicationYear);
    expect(searchParams.get(ResultParam.ExcludeParentPublicationYear)).toBe(
      searchParams.get(ResultParam.PublicationYear)
    );
  });

  test('should not exclude a parent publication year for any other list', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      commonConfig
    );

    expect(searchParams.has(ResultParam.ExcludeParentPublicationYear)).toBe(false);
  });
});

describe('getAccordionDefaultPath', () => {
  test('should link to the correction list page with the first list opened and filtered', () => {
    const path = getAccordionDefaultPath(buildConfig(), commonConfig);
    const [pathname, search] = path.split('?');
    const searchParams = new URLSearchParams(search);

    expect(pathname).toBe(UrlPathTemplate.TasksNviCorrectionList);
    expect(searchParams.get(nviCorrectionListQueryKey)).toBe(
      CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel
    );
    expect(searchParams.get(ResultParam.PublicationYear)).toBe(commonConfig.publicationYear);
  });
});

describe('isCorrectionListName', () => {
  test.each(Object.values(CorrectionListNames))('should accept the known list name %s', (listName) => {
    expect(isCorrectionListName(listName)).toBe(true);
  });

  test('should reject a string that is not a list name', () => {
    expect(isCorrectionListName('SomeOtherList')).toBe(false);
  });

  test('should reject an empty string', () => {
    expect(isCorrectionListName('')).toBe(false);
  });

  test('should reject a list name with different casing', () => {
    expect(isCorrectionListName(CorrectionListNames.AnthologyWithoutChapter.toLowerCase())).toBe(false);
  });
});
