import { useSelector } from 'react-redux';
import { useFetchChannelClaim } from '../../api/hooks/useFetchChannelClaim';
import { RootState } from '../../redux/store';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import {
  getAssociatedFiles,
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

  if (!getAssociatedFiles(registration.associatedArtifacts).some((file) => file.type === 'OpenFile')) {
    return { isLoading: false, shouldDisableFields: false };
  }

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

  // if (isDegree(registration.entityDescription.reference.publicationInstance.type) && user?.isThesisCurator) {
  //   return { isLoading: false, shouldDisableFields: false };
  // } else if (!isDegree(registration.entityDescription.reference.publicationInstance.type) && hasCuratorRole(user)) {
  //   return { isLoading: false, shouldDisableFields: false };
  // }

  // if (channelClaimQuery.data.channelClaim.constraint.editingPolicy === 'Everyone') {
  //   return { isLoading: false, shouldDisableFields: false };
  // }

  // if (channelClaimQuery.data.channelClaim.constraint.editingPolicy === 'OwnerOnly') {
  //   return {
  //     isLoading: false,
  //     shouldDisableFields: user?.topOrgCristinId === channelClaimQuery.data.claimedBy.organizationId,
  //   };
  // }

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
    return (registration.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher?.id; // TODO: Should consider claimed series if not claimed publisher
  }
  if (canHaveJournal) {
    return (registration.entityDescription?.reference?.publicationContext as JournalPublicationContext).id;
  }
  return;
};
