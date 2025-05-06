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
import { hasCuratorRole } from '../user-helpers';
import { useBetaFlag } from './useBetaFlag';

export const useShouldDisableFieldsDueToChannelClaims = (registration?: Registration) => {
  const user = useSelector((state: RootState) => state.user);
  const beta = useBetaFlag();

  const shouldFetch = beta && registration?.entityDescription?.reference?.publicationInstance?.type;

  const channelId = shouldFetch ? getChannelId(registration) : '';
  const channelClaimQuery = useFetchChannelClaim(channelId);

  if (!beta) {
    return { isLoading: false, shouldDisableFields: false };
  }

  if (!registration?.entityDescription?.reference?.publicationInstance?.type) {
    return { isLoading: false, shouldDisableFields: false };
  }

  if (!channelClaimQuery.data) {
    return { isLoading: channelClaimQuery.isFetching, shouldDisableFields: false };
  }

  if (!registration.associatedArtifacts.some(isOpenFile)) {
    return { isLoading: false, shouldDisableFields: false };
  }

  const claimedByCurrentInstitution =
    !!channelClaimQuery.data && channelClaimQuery.data.claimedBy.organizationId === user?.topOrgCristinId;
  if (claimedByCurrentInstitution) {
    return { isLoading: false, shouldDisableFields: false };
  }

  const claimedForThisCategory = channelClaimQuery.data.channelClaim.constraint.scope.includes(
    registration.entityDescription.reference.publicationInstance.type
  );
  if (!claimedForThisCategory) {
    return { isLoading: false, shouldDisableFields: false };
  }

  if (channelClaimQuery.data.channelClaim.constraint.editingPolicy === 'Everyone') {
    return { isLoading: false, shouldDisableFields: false };
  }

  const registrationIsOwnedByUserInstitution = user?.topOrgCristinId === registration.resourceOwner.ownerAffiliation;
  if (isDegree(registration.entityDescription.reference.publicationInstance.type)) {
    if (user?.isThesisCurator && registrationIsOwnedByUserInstitution) {
      return { isLoading: false, shouldDisableFields: false };
    }
  } else {
    if (hasCuratorRole(user) && registrationIsOwnedByUserInstitution) {
      return { isLoading: false, shouldDisableFields: false };
    }
  }

  return { isLoading: channelClaimQuery.isFetching, shouldDisableFields: true };
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
