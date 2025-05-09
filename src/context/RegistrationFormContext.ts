import { createContext } from 'react';
import { ClaimedChannel } from '../types/customerInstitution.types';

interface RegistrationFormContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
  publisherClaim?: ClaimedChannel;
  // setPublisherClaim?: (claim: ClaimedChannel) => void;
  seriesClaim?: ClaimedChannel;
  journalClaim?: ClaimedChannel;
}

export const RegistrationFormContext = createContext<RegistrationFormContextType>({
  disableNviCriticalFields: false,
  disableChannelClaimsFields: false,
});
