import { createContext } from 'react';

interface RegistrationFormContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
}

export const RegistrationFormContext = createContext<RegistrationFormContextType>({
  disableNviCriticalFields: false,
  disableChannelClaimsFields: false,
});
