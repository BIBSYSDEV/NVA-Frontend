import { createContext, ReactNode, useState } from 'react';
import { HighestTouchedTab } from '../types/locationState.types';
import { RegistrationTab } from '../types/registration.types';

interface RegistrationFormContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
  highestVisitedTab: HighestTouchedTab;
  setHighestVisitedTab: (tab: RegistrationTab) => void;
}

export const RegistrationFormContext = createContext<RegistrationFormContextType>({
  disableNviCriticalFields: false,
  disableChannelClaimsFields: false,
  highestVisitedTab: -1,
  setHighestVisitedTab: () => {},
});

interface RegistrationFormContextProviderProps {
  children: ReactNode;
  value: Omit<RegistrationFormContextType, 'setHighestVisitedTab'>;
}

export const RegistrationFormContextProvider = ({ children, value }: RegistrationFormContextProviderProps) => {
  const [validatedTab, setValidatedTab] = useState(value.highestVisitedTab);

  return (
    <RegistrationFormContext.Provider
      value={{
        disableNviCriticalFields: value.disableNviCriticalFields ?? false,
        disableChannelClaimsFields: value.disableChannelClaimsFields ?? false,
        highestVisitedTab: validatedTab,
        setHighestVisitedTab: (tab: RegistrationTab) => setValidatedTab(tab),
      }}>
      {children}
    </RegistrationFormContext.Provider>
  );
};
