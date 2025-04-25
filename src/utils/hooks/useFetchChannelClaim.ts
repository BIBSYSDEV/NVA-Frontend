import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import {
  isBook,
  isDegree,
  isJournal,
  isOtherRegistration,
  isPeriodicalMediaContribution,
  isReport,
  isResearchData,
} from '../registration-helpers';

export const useShouldDisableFieldsDueToChannelClaims = (registration?: Registration) => {
  if (!registration?.entityDescription?.reference?.publicationInstance?.type) {
    return { isLoading: false, shouldDisableFields: false };
  }

  // Find channel ID that should take precendence for this registration
  const category = registration.entityDescription?.reference?.publicationInstance?.type;

  if (!category) {
    return { isLoading: false, shouldDisableFields: false };
  }

  const canHavePublisher = // TODO: Should handle chapter as well
    isBook(category) ||
    isDegree(category) ||
    isReport(category) ||
    isResearchData(category) ||
    isOtherRegistration(category);

  const canHaveJournal = !canHavePublisher && (isJournal(category) || isPeriodicalMediaContribution(category));

  const channelId = canHavePublisher
    ? (registration.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher?.id // TODO: Can ignore series?
    : canHaveJournal
      ? (registration.entityDescription?.reference?.publicationContext as JournalPublicationContext).id
      : null;

  if (channelId) {
    return { isLoading: false, shouldDisableFields: false };
  }

  // TODO: Fetch channel claim
  // TOOO: Check if channel claims this category for another institution
  // TODO: Check if user has curator roles that overrides the channel claim
  // TODO: Return shouldDisableFields = true if fields should be disabled due to channel claims

  return { isLoading: false, shouldDisableFields: false };
};
