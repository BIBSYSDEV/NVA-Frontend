import { ResultParam } from '../../api/searchApi';
import { ScientificValueLevels } from '../../pages/search/advanced_search/ScientificValueFilter';
import { CorrectionListSearchConfig } from '../../types/nvi.types';
import { BookType, ChapterType } from '../../types/publicationFieldNames';
import { nviApplicableTypes } from '../registration-helpers';
import { useLoggedInUser } from './useLoggedInUser';

export const useCorrectionListConfig = (): CorrectionListSearchConfig => {
  const user = useLoggedInUser();
  const userTopLevelOrg = user?.topOrgCristinId;
  const searchParams = new URLSearchParams(location.search);

  const correctionListConfig: CorrectionListSearchConfig = {
    ApplicableCategoriesWithNonApplicableChannel: {
      i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
      queryParams: {
        categoryShould: nviApplicableTypes,
        allScientificValues: [ScientificValueLevels.Unassigned, ScientificValueLevels.LevelZero].join(','),
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    NonApplicableCategoriesWithApplicableChannel: {
      i18nKey: 'tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel',
      queryParams: {
        categoryNot: nviApplicableTypes,
        scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
      },
      disabledFilters: [ResultParam.CategoryShould],
      topLevelOrganization: userTopLevelOrg,
    },
    AnthologyWithoutChapter: {
      i18nKey: 'tasks.nvi.correction_list_type.anthology_without_chapter',
      queryParams: {
        categoryShould: [BookType.Anthology],
        hasChildren: false,
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    BooksWithLessThan50Pages: {
      i18nKey: 'tasks.nvi.correction_list_type.book_with_less_than_50_pages',
      queryParams: {
        categoryShould: Object.values(BookType),
        publicationPages: '0,50',
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    YearBetweenChapterAndBookMismatch: {
      i18nKey: 'tasks.nvi.correction_list_type.chapter_and_book_year_mismatch',
      queryParams: {
        categoryShould: [ChapterType.AcademicChapter],
        hasParent: true,
        excludeParentPublicationYear: 'true',
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    AnthologyWithApplicableChapter: {
      i18nKey: 'tasks.nvi.correction_list_type.anthology_with_applicable_chapter',
      queryParams: {
        categoryShould: [BookType.Anthology],
        hasChildren: true,
        scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    UnidentifiedContributorWithIdentifiedAffiliation: {
      i18nKey: 'tasks.nvi.correction_list_type.unidentified_contributor_with_identified_affiliation',
      queryParams: {
        unidentifiedNorwegian: true,
        categoryShould: nviApplicableTypes,
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    ScientificChapterNotInAnthology: {
      i18nKey: 'tasks.nvi.correction_list_type.scientific_chapter_not_in_anthology',
      queryParams: {
        categoryShould: [ChapterType.AcademicChapter],
        excludeParentType: [BookType.Anthology],
        scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
        hasParent: true,
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
    ScientificMonographyOrAnthologyWithoutIsxns: {
      i18nKey: 'tasks.nvi.correction_list_type.scientific_monography_or_anthology_without_isxns',
      queryParams: {
        categoryShould: [
          BookType.AcademicMonograph,
          BookType.AcademicCommentary,
          BookType.NonFictionMonograph,
          BookType.PopularScienceMonograph,
          BookType.Textbook,
          BookType.Encyclopedia,
          BookType.ExhibitionCatalog,
          BookType.Anthology,
        ],
        excludeScientificValueSeries: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo],
        hasIsbn: false,
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
  };

  return correctionListConfig;
};
