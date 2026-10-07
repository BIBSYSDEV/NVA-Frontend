import { useTranslation } from 'react-i18next';
import { ResultParam } from '../../api/searchApi';
import { ScientificValueLevels } from '../../pages/search/advanced_search/ScientificValueFilter';
import { CorrectionListConfig } from '../../types/nvi.types';
import { BookType, ChapterType, ReportType } from '../../types/publicationFieldNames';
import { getDisabledCategoriesOutside } from '../correctionListHelpers';
import { nviApplicableTypes } from '../registration-helpers';
import { useLoggedInUser } from './useLoggedInUser';

export const useCorrectionListConfig = (): CorrectionListConfig => {
  const { t } = useTranslation();
  const user = useLoggedInUser();
  const userTopLevelOrg = user?.topOrgCristinId;

  const bookTypes = Object.values(BookType);
  const nonBookDisabledCategories = getDisabledCategoriesOutside(
    bookTypes,
    t('tasks.nvi.only_book_categories_available')
  );
  const nonBookOrReportDisabledCategories = getDisabledCategoriesOutside(
    [...bookTypes, ...Object.values(ReportType)],
    t('only_book_and_report_categories_available')
  );
  const nonAcademicChapterDisabledCategories = getDisabledCategoriesOutside(
    [ChapterType.AcademicChapter],
    t('only_academic_chapter_category_available')
  );

  return {
    ApplicableCategoriesWithNonApplicableChannel: {
      i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
      queryParams: {
        categoryShould: nviApplicableTypes,
        allScientificValues: [ScientificValueLevels.Unassigned, ScientificValueLevels.LevelZero].join(','),
      },
      disabledFilters: [],
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    NonApplicableCategoriesWithApplicableChannel: {
      i18nKey: 'tasks.nvi.correction_list_type.non_applicable_category_in_applicable_channel',
      queryParams: {
        categoryNot: nviApplicableTypes,
        scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
      },
      disabledFilters: [ResultParam.CategoryShould],
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    AnthologyWithoutChapter: {
      i18nKey: 'tasks.nvi.correction_list_type.anthology_without_chapter',
      queryParams: {
        categoryShould: [BookType.Anthology],
        hasChildren: false,
      },
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    BooksWithLessThan50Pages: {
      i18nKey: 'tasks.nvi.correction_list_type.book_with_less_than_50_pages',
      queryParams: {
        categoryShould: Object.values(BookType),
        publicationPages: '0,50',
      },
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    YearBetweenChapterAndBookMismatch: {
      i18nKey: 'tasks.nvi.correction_list_type.chapter_and_book_year_mismatch',
      queryParams: {
        categoryShould: [ChapterType.AcademicChapter],
        hasParent: true,
      },
      disabledFilters: [],
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: false,
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
      showScientificValueFilter: false,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    UnidentifiedContributorWithIdentifiedAffiliation: {
      i18nKey: 'tasks.nvi.correction_list_type.unidentified_contributor_with_identified_affiliation',
      queryParams: {
        unidentifiedNorwegian: true,
        unidentifiedContributorInstitution: userTopLevelOrg,
        categoryShould: nviApplicableTypes,
      },
      disabledFilters: [],
      showScientificValueFilter: false,
      showChannelFilters: true,
      showAllYearsOption: true,
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
      showScientificValueFilter: true,
      showChannelFilters: false,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    BookOrReportWithoutIsxn: {
      i18nKey: 'book_or_report_without_isxn',
      queryParams: {
        categoryShould: [BookType.AcademicMonograph, BookType.AcademicCommentary, BookType.Anthology],
        hasIsbn: false,
      },
      disabledFilters: [],
      disabledCategories: nonBookOrReportDisabledCategories,
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    BooksWithoutNpiField: {
      i18nKey: 'tasks.nvi.correction_list_type.books_without_npi_field',
      queryParams: {
        categoryShould: [BookType.AcademicMonograph, BookType.AcademicCommentary],
        hasNpiSubjectHeading: false,
        scientificValue: [ScientificValueLevels.LevelOne, ScientificValueLevels.LevelTwo].join(','),
      },
      disabledFilters: [],
      disabledCategories: nonBookDisabledCategories,
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
    AcademicChapterInBookWithoutIsbn: {
      i18nKey: 'academic_chapter_in_book_without_isbn',
      queryParams: {
        categoryShould: [ChapterType.AcademicChapter],
        hasIsbn: false,
        hasParent: true,
      },
      disabledFilters: [],
      disabledCategories: nonAcademicChapterDisabledCategories,
      showScientificValueFilter: true,
      showChannelFilters: true,
      showAllYearsOption: true,
      topLevelOrganization: userTopLevelOrg,
    },
  };
};
