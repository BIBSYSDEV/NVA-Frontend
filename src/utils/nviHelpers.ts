import { Contributor } from '../types/contributor.types';
import { BookRegistration } from '../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../types/publication_types/journalRegistration.types';
import { Registration } from '../types/registration.types';
import { nviApplicableTypes } from './registration-helpers';

const minNviYear = 2011;

export const getNviYearFilterValues = () => {
  const thisYear = new Date().getFullYear();
  const nviYearFilterValues = [];
  for (let year = thisYear + 1; year >= minNviYear; year--) {
    nviYearFilterValues.push(year);
  }
  return nviYearFilterValues;
};

const hasChangedContributors = (persistedContributors: Contributor[], updatedContributors: Contributor[]) => {
  if (persistedContributors.length !== updatedContributors.length) {
    return true;
  }

  const sortedPersistedContributorIds = persistedContributors.map((contributor) => contributor.identity.id).sort();
  const sortedUpdatedContributorIds = updatedContributors.map((contributor) => contributor.identity.id).sort();

  return sortedPersistedContributorIds.some((id, index) => id !== sortedUpdatedContributorIds[index]);
};

const hasChangedAffiliations = (persistedContributors: Contributor[], updatedContributors: Contributor[]) => {
  for (const persistedContributor of persistedContributors) {
    const updatedContributor = updatedContributors.find(
      (contributor) => contributor.identity.id === persistedContributor.identity.id
    );
    if (updatedContributor) {
      const persistedAffiliations = persistedContributor.affiliations ?? [];
      const updatedAffiliations = updatedContributor.affiliations ?? [];
      if (
        persistedAffiliations.length !== updatedAffiliations.length ||
        persistedAffiliations.some((value, index) => value !== updatedAffiliations[index])
      ) {
        return true;
      }
    }
  }
  return false;
};

export const willResetNviStatuses = (persistedRegistration: Registration, updatedRegistration: Registration) => {
  const canBeNviCandidate = nviApplicableTypes.includes(
    persistedRegistration.entityDescription?.reference?.publicationInstance?.type ?? ''
  );
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
    hasChangedContributors(
      persistedRegistration.entityDescription?.contributors ?? [],
      updatedRegistration.entityDescription?.contributors ?? []
    )
  ) {
    return true;
  }
};
