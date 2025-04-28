import { useSelector } from 'react-redux';
import { useFetchChannelClaim } from '../../api/hooks/useFetchChannelClaim';
import { RootState } from '../../redux/store';
import { FileType } from '../../types/associatedArtifact.types';
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

  if (!registration?.entityDescription?.reference?.publicationInstance?.type) {
    return { isLoading: false, shouldDisableFields: false };
  }

  // TODO: Return false if no claim

  const claimedByOtherInstitution =
    !!channelClaimQuery.data && channelClaimQuery.data.claimedBy.organizationId !== user?.topOrgCristinId;

  if (!claimedByOtherInstitution) {
    return { isLoading: false, shouldDisableFields: false };
  }

  const claimedForThisCategory = channelClaimQuery.data.channelClaim.constraint.scope.includes(
    registration.entityDescription.reference.publicationInstance.type
  );
  if (!claimedForThisCategory) {
    return { isLoading: false, shouldDisableFields: false };
  }

  const isThesisCurator =
    isDegree(registration.entityDescription.reference.publicationInstance.type) &&
    user?.isThesisCurator &&
    registration.allowedOperations?.includes('update'); // TODO: All returns should consider this?

  if (isThesisCurator && registration.associatedArtifacts.some((artifact) => artifact.type !== FileType.OpenFile)) {
    return { isLoading: false, shouldDisableFields: false };
  }

  if (channelClaimQuery.data.channelClaim.constraint.editingPolicy === 'Everyone') {
    return { isLoading: false, shouldDisableFields: registration.allowedOperations?.includes('update') };
  }

  if (channelClaimQuery.data.channelClaim.constraint.editingPolicy === 'OwnerOnly') {
    return {
      isLoading: false,
      shouldDisableFields: user?.topOrgCristinId === channelClaimQuery.data.claimedBy.organizationId,
    };
  }

  // TODO: Check if user has curator roles that overrides the channel claim?

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
