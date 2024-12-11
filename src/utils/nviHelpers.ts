import { fetchOrganization } from '../api/cristinApi';
import { Contributor } from '../types/contributor.types';
import { NviCandidate } from '../types/nvi.types';
import { BookRegistration } from '../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';
import { Registration } from '../types/registration.types';
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
      (contributor) => contributor.identity.id === persistedContributor.identity.id
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
    persistedRegistration.entityDescription?.reference?.publicationInstance.type !==
    updatedRegistration.entityDescription?.reference?.publicationInstance.type;
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
};

export const isApprovedAndOpenNviCandidate = (nviCandidate: NviCandidate) =>
  nviCandidate.period.status === 'OpenPeriod' &&
  nviCandidate.approvals.every((candidate) => candidate.status === 'Approved');
