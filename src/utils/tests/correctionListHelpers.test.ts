import { describe, expect, test } from 'vitest';
import { ResultParam } from '../../api/searchApi';
import { ScientificValueLevels } from '../../pages/search/advanced_search/ScientificValueFilter';
import { CorrectionListConfig, CorrectionListNames } from '../../types/nvi.types';
import { allPublicationInstanceTypes, BookType, ChapterType, JournalType } from '../../types/publicationFieldNames';
import {
  getAccordionDefaultPath,
  getCorrectionListSearchParams,
  getDisabledCategoriesOutside,
  isCorrectionListName,
  nviCorrectionListQueryKey,
  setPublicationYearParams,
} from '../correctionListHelpers';
import { UrlPathTemplate } from '../urlPaths';

const publicationYear = '2026';

const disabledText = 'Not available';

/**
 * Creates a config where every list has no filters, so that each test can give a single list only
 * the filters it needs to verify.
 */
const buildConfig = (overrides: Partial<CorrectionListConfig> = {}): CorrectionListConfig => {
  const emptyConfig = Object.values(CorrectionListNames).reduce((config, listId) => {
    config[listId] = {
      i18nKey: 'tasks.correction_list',
      queryParams: {},
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: false,
      showAllYearsOption: true,
      topLevelOrganization: undefined,
    };
    return config;
  }, {} as CorrectionListConfig);

  return { ...emptyConfig, ...overrides };
};

/** Creates a config where a single list has the given filters, and every other list has none. */
const buildConfigForList = (
  listId: CorrectionListNames,
  queryParams: CorrectionListConfig[CorrectionListNames]['queryParams'],
  topLevelOrganization?: string
) =>
  buildConfig({
    [listId]: {
      i18nKey: 'tasks.correction_list',
      queryParams,
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: false,
      showAllYearsOption: true,
      topLevelOrganization,
    },
  });

describe('setPublicationYearParams', () => {
  test('should keep the excluded parent year equal to the publication year for the chapter and book year mismatch list', () => {
    const searchParams = new URLSearchParams();

    setPublicationYearParams(searchParams, CorrectionListNames.YearBetweenChapterAndBookMismatch, '2025');

    expect(searchParams.get(ResultParam.PublicationYear)).toBe('2025');
    expect(searchParams.get(ResultParam.ExcludeParentPublicationYear)).toBe('2025');
  });

  test('should move both years together when the year is changed again', () => {
    const searchParams = new URLSearchParams();

    setPublicationYearParams(searchParams, CorrectionListNames.YearBetweenChapterAndBookMismatch, '2026');
    setPublicationYearParams(searchParams, CorrectionListNames.YearBetweenChapterAndBookMismatch, '2025');

    expect(searchParams.get(ResultParam.PublicationYear)).toBe('2025');
    expect(searchParams.get(ResultParam.ExcludeParentPublicationYear)).toBe('2025');
  });

  test('should not exclude a parent year for any other list', () => {
    const searchParams = new URLSearchParams();

    setPublicationYearParams(searchParams, CorrectionListNames.AnthologyWithoutChapter, '2026');

    expect(searchParams.get(ResultParam.PublicationYear)).toBe('2026');
    expect(searchParams.has(ResultParam.ExcludeParentPublicationYear)).toBe(false);
  });

  test('should remove a stale excluded parent year when switching to a list that should not have one', () => {
    const searchParams = new URLSearchParams({ [ResultParam.ExcludeParentPublicationYear]: '2026' });

    setPublicationYearParams(searchParams, CorrectionListNames.AnthologyWithoutChapter, '2026');

    expect(searchParams.has(ResultParam.ExcludeParentPublicationYear)).toBe(false);
  });

  test('should not exclude a parent year when no list is selected', () => {
    const searchParams = new URLSearchParams();

    setPublicationYearParams(searchParams, null, '2026');

    expect(searchParams.get(ResultParam.PublicationYear)).toBe('2026');
    expect(searchParams.has(ResultParam.ExcludeParentPublicationYear)).toBe(false);
  });

  test('should leave unrelated params untouched', () => {
    const searchParams = new URLSearchParams({
      [ResultParam.TopLevelOrganization]: 'https://api.com/organization/1.0',
    });

    setPublicationYearParams(searchParams, CorrectionListNames.AnthologyWithoutChapter, '2026');

    expect(searchParams.get(ResultParam.TopLevelOrganization)).toBe('https://api.com/organization/1.0');
  });
});

describe('getCorrectionListSearchParams', () => {
  test('should set the given list id, so the page knows which list to show', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      publicationYear
    );

    expect(searchParams.get(nviCorrectionListQueryKey)).toBe(CorrectionListNames.AnthologyWithoutChapter);
  });

  test('should set the publication year from the common config', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      publicationYear
    );

    expect(searchParams.get(ResultParam.PublicationYear)).toBe(publicationYear);
  });

  test('should set only the list id and publication year when the list has no filters', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.AnthologyWithoutChapter,
      publicationYear
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
      publicationYear
    );

    expect(searchParams.get(ResultParam.CategoryShould)).toBe(`${BookType.Anthology},${ChapterType.AcademicChapter}`);
  });

  test('should not set categories when the configured list of categories is empty', () => {
    const config = buildConfigForList(CorrectionListNames.AnthologyWithoutChapter, { categoryShould: [] });

    const searchParams = getCorrectionListSearchParams(
      config,
      CorrectionListNames.AnthologyWithoutChapter,
      publicationYear
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
      publicationYear
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
      publicationYear
    );

    expect(searchParams.get(ResultParam.UnidentifiedContributorInstitution)).toBe('/organization/1.0');
  });

  test('should exclude the same year as the publication year for the chapter and book year mismatch list', () => {
    const searchParams = getCorrectionListSearchParams(
      buildConfig(),
      CorrectionListNames.YearBetweenChapterAndBookMismatch,
      publicationYear
    );

    expect(searchParams.get(ResultParam.ExcludeParentPublicationYear)).toBe(publicationYear);
  });
});

describe('getAccordionDefaultPath', () => {
  test('should link to the correction list page with the first list opened and filtered', () => {
    const path = getAccordionDefaultPath(buildConfig(), publicationYear);
    const [pathname, search] = path.split('?');
    const searchParams = new URLSearchParams(search);

    expect(pathname).toBe(UrlPathTemplate.TasksNviCorrectionList);
    expect(searchParams.get(nviCorrectionListQueryKey)).toBe(
      CorrectionListNames.ApplicableCategoriesWithNonApplicableChannel
    );
    expect(searchParams.get(ResultParam.PublicationYear)).toBe(publicationYear);
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

describe('getDisabledCategoriesOutside', () => {
  test('does not disable the allowed types', () => {
    const disabledCategories = getDisabledCategoriesOutside(
      [BookType.AcademicMonograph, BookType.Anthology],
      disabledText
    );
    const disabledTypes = disabledCategories.map((category) => category.type);

    expect(disabledTypes).not.toContain(BookType.AcademicMonograph);
    expect(disabledTypes).not.toContain(BookType.Anthology);
  });

  test('disables every other type with the given text', () => {
    const allowedTypes = Object.values(BookType);
    const disabledCategories = getDisabledCategoriesOutside(allowedTypes, disabledText);

    expect(disabledCategories).toHaveLength(allPublicationInstanceTypes.length - allowedTypes.length);
    expect(disabledCategories).toContainEqual({ type: JournalType.AcademicArticle, text: disabledText });
    expect(disabledCategories.every((category) => category.text === disabledText)).toBe(true);
  });

  test('disables all types when no types are allowed', () => {
    const disabledCategories = getDisabledCategoriesOutside([], disabledText);

    expect(disabledCategories.map((category) => category.type)).toEqual(allPublicationInstanceTypes);
  });
});
