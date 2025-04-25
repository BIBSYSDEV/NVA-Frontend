import { useSelector } from 'react-redux';
import { useFetchChannelClaim } from '../../api/hooks/useFetchChannelClaim';
import { RootState } from '../../redux/store';
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
import { useBetaFlag } from './useBetaFlag';

export const useShouldDisableFieldsDueToChannelClaims = (registration?: Registration) => {
  const user = useSelector((state: RootState) => state.user);
  const beta = useBetaFlag();

  const channelId = beta ? getChannelId(registration) : '';
  const channelClaimQuery = useFetchChannelClaim(channelId);

  const claimedByOtherInstitution =
    !!channelClaimQuery.data && channelClaimQuery.data.claimedBy.organizationId !== user?.topOrgCristinId;

  // TOOO: Check if channel claims this category for another institution
  // TODO: Check if user has curator roles that overrides the channel claim
  // TODO: Return shouldDisableFields = true if fields should be disabled due to channel claims

  return { isLoading: channelClaimQuery.isFetching, shouldDisableFields: claimedByOtherInstitution };
};

const getChannelId = (registration?: Registration) => {
  // Find channel ID that should take precendence for this registration
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
    return (registration.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher?.id; // TODO: Can ignore series?
  }
  if (canHaveJournal) {
    return (registration.entityDescription?.reference?.publicationContext as JournalPublicationContext).id;
  }
  return;
};
