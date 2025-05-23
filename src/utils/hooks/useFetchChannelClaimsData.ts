import { useFetchChannelClaim } from '../../api/hooks/useFetchChannelClaim';
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
  userHasAccessRight,
} from '../registration-helpers';

export const useFetchChannelClaimsData = (registration?: Registration) => {
  const canUpdateEverything = userHasAccessRight(registration, 'update');

  const channelId = getChannelId(registration) ?? '';
  const channelClaimQuery = useFetchChannelClaim(channelId, { enabled: !canUpdateEverything });

  return { channelClaimQuery: channelClaimQuery, shouldDisableFields: !canUpdateEverything };
};

const getChannelId = (registration?: Registration) => {
  const category = registration?.entityDescription?.reference?.publicationInstance?.type;
  if (!category) {
    return;
  }

  const canHavePublisher = // TODO: Should handle chapter as well
    isBook(category) ||
    isDegree(category) ||
    isReport(category) ||
    isResearchData(category) ||
    isOtherRegistration(category);

  const canHaveJournal = !canHavePublisher && (isJournal(category) || isPeriodicalMediaContribution(category));

  if (canHavePublisher) {
    // TODO: Should consider claimed series if publisher is not claimed
    return (registration.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher?.id;
  }
  if (canHaveJournal) {
    return (registration.entityDescription?.reference?.publicationContext as JournalPublicationContext).id;
  }
  return;
};
