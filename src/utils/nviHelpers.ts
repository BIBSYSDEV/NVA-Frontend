import { fetchOrganization } from '../api/cristinApi';
import { ResultParam } from '../api/searchApi';
import { ScientificValueLevels } from '../pages/search/advanced_search/ScientificValueFilter';
import { Contributor } from '../types/contributor.types';
import { CorrectionListSearchConfig, NviCandidateProblem } from '../types/nvi.types';
import { BookRegistration } from '../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';
import { BookType } from '../types/publicationFieldNames';
import { Registration } from '../types/registration.types';
import { useLoggedInUser } from './hooks/useLoggedInUser';
import { getTopLevelOrganization } from './institutions-helpers';
import { nviApplicableTypes } from './registration-helpers';

const minNviYear = 2011;
export const getNviYearFilterValues = (maxYear: number) =>
  Array.from({ length: maxYear - minNviYear + 1 }, (_, i) => maxYear - i);

const isEqualSets = (set1: Set<string>, set2: Set<string>) => {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
};

const hasChangedContributorsOrAffiliations = async (
  persistedContributors: Contributor[],
  updatedContributors: Contributor[]
) => {
  const topLevelOrgCache: { [key: string]: string } = {};

  const getTopLevelOrgId = async (affiliationId: string) => {
    if (!topLevelOrgCache[affiliationId]) {
      const organization = await fetchOrganization(affiliationId);
      const topLevelOrg = getTopLevelOrganization(organization);
      topLevelOrgCache[affiliationId] = topLevelOrg.id;
    }
    return topLevelOrgCache[affiliationId];
  };

  if (persistedContributors.length !== updatedContributors.length) {
    return true;
  }

  for (const persistedContributor of persistedContributors) {
    const updatedContributor = updatedContributors.find(
      (contributor) =>
        (contributor.identity.id && contributor.identity.id === persistedContributor.identity.id) ||
        contributor.identity.name === persistedContributor.identity.name
    );
    if (updatedContributor) {
      const persistedAffiliations = persistedContributor.affiliations ?? [];
      const updatedAffiliations = updatedContributor.affiliations ?? [];
      const persistedTopLevelOrgs = new Set<string>();
      const updatedTopLevelOrgs = new Set<string>();

      for (const affiliation of persistedAffiliations) {
        if (affiliation.type === 'Organization' && affiliation.id) {
          const topLevelOrgId = await getTopLevelOrgId(affiliation.id);
          persistedTopLevelOrgs.add(topLevelOrgId);
        }
      }

      for (const affiliation of updatedAffiliations) {
        if (affiliation.type === 'Organization' && affiliation.id) {
          const topLevelOrgId = await getTopLevelOrgId(affiliation.id);
          updatedTopLevelOrgs.add(topLevelOrgId);
        }
      }

      if (!isEqualSets(persistedTopLevelOrgs, updatedTopLevelOrgs)) {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
};

export const willResetNviStatuses = async (persistedRegistration: Registration, updatedRegistration: Registration) => {
  const canBeNviCandidate =
    !!persistedRegistration.entityDescription?.reference?.publicationInstance?.type &&
    nviApplicableTypes.includes(persistedRegistration.entityDescription?.reference?.publicationInstance?.type);
  if (!canBeNviCandidate) {
    return false;
  }

  const hasChangedYear =
    persistedRegistration.entityDescription?.publicationDate?.year !==
    updatedRegistration.entityDescription?.publicationDate?.year;
  if (hasChangedYear) {
    return true;
  }

  const hasChangedCategory =
    persistedRegistration.entityDescription?.reference?.publicationInstance?.type !==
    updatedRegistration.entityDescription?.reference?.publicationInstance?.type;
  if (hasChangedCategory) {
    return true;
  }

  const persistedRegistrationWithContextId = persistedRegistration as JournalRegistration | ChapterRegistration;
  const updatedRegistrationWithContextId = updatedRegistration as JournalRegistration | ChapterRegistration;
  const hasChangedContextId =
    persistedRegistrationWithContextId.entityDescription?.reference?.publicationContext?.id !==
    updatedRegistrationWithContextId.entityDescription?.reference?.publicationContext?.id;
  if (hasChangedContextId) {
    return true;
  }

  const persistedRegistrationWithPublisher = persistedRegistration as BookRegistration;
  const updatedRegistrationWithPublisher = updatedRegistration as BookRegistration;
  const hasChangedPublisher =
    updatedRegistrationWithPublisher.entityDescription?.reference?.publicationContext?.publisher?.id !==
    persistedRegistrationWithPublisher.entityDescription?.reference?.publicationContext?.publisher?.id;
  if (hasChangedPublisher) {
    return true;
  }

  const hasChangedSeries =
    updatedRegistrationWithPublisher.entityDescription?.reference?.publicationContext?.series?.id !==
    persistedRegistrationWithPublisher.entityDescription?.reference?.publicationContext?.series?.id;
  if (hasChangedSeries) {
    return true;
  }

  if (
    await hasChangedContributorsOrAffiliations(
      persistedRegistration.entityDescription?.contributors ?? [],
      updatedRegistration.entityDescription?.contributors ?? []
    )
  ) {
    return true;
  }
  return false;
};

export const hasUnidentifiedContributorProblem = (nviCandidateProblems: NviCandidateProblem[]) =>
  nviCandidateProblems &&
  nviCandidateProblems.some(
    (problem) =>
      problem.type === 'UnverifiedCreatorExists' || problem.type === 'UnverifiedCreatorFromOrganizationProblem'
  );

export const useCorrectionListConfig = (): CorrectionListSearchConfig => {
  const user = useLoggedInUser();
  const userTopLevelOrg = user?.topOrgCristinId;

  const correctionListConfig: CorrectionListSearchConfig = {
    ApplicableCategoriesWithNonApplicableChannel: {
      i18nKey: 'tasks.nvi.correction_list_type.applicable_category_in_non_applicable_channel',
      queryParams: {
        categoryShould: nviApplicableTypes,
        allScientificValues: ScientificValueLevels.LevelZero,
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
        hasNoChildren: false,
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
      },
      disabledFilters: [],
      topLevelOrganization: userTopLevelOrg,
    },
  };

  return correctionListConfig;
};
