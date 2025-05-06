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
  isOpenFile,
  isOtherRegistration,
  isPeriodicalMediaContribution,
  isReport,
  isResearchData,
} from '../registration-helpers';
import { useBetaFlag } from './useBetaFlag';

export const useFetchChannelClaimsData = (registration?: Registration) => {
  const user = useSelector((state: RootState) => state.user);
  const beta = useBetaFlag();

  const shouldFetch = beta && registration?.entityDescription?.reference?.publicationInstance?.type;

  const channelId = shouldFetch ? getChannelId(registration) : '';
  const channelClaimQuery = useFetchChannelClaim(channelId);
  if (!beta) {
    return { channelClaimQuery: channelClaimQuery, shouldDisableFields: false };
  }

  if (!registration?.entityDescription?.reference?.publicationInstance?.type) {
    return { channelClaimQuery: channelClaimQuery, shouldDisableFields: false };
  }

  if (!channelClaimQuery.data) {
    return { channelClaimQuery: channelClaimQuery, shouldDisableFields: false };
  }

  if (!user) {
    return { channelClaimQuery: channelClaimQuery, shouldDisableFields: true };
  }

  if (
    isDegree(registration.entityDescription.reference.publicationInstance.type) &&
    registration.associatedArtifacts.some(isOpenFile)
  ) {
    if (!user.isThesisCurator) {
      return { channelClaimQuery: channelClaimQuery, shouldDisableFields: true };
    }
    if (channelClaimQuery.data.claimedBy.organizationId !== user.topOrgCristinId) {
      return { channelClaimQuery: channelClaimQuery, shouldDisableFields: true };
    } else if (user.topOrgCristinId !== registration.resourceOwner.ownerAffiliation) {
      return { channelClaimQuery: channelClaimQuery, shouldDisableFields: true };
    }
  }

  return { channelClaimQuery: channelClaimQuery, shouldDisableFields: false };
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
    return (registration.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher?.id; // TODO: Should consider claimed series if not claimed publisher
  }
  if (canHaveJournal) {
    return (registration.entityDescription?.reference?.publicationContext as JournalPublicationContext).id;
  }
  return;
};
