import { createContext, ReactNode, useState } from 'react';
import { RegistrationTab } from '../types/registration.types';

export type HighesVisitedTab = RegistrationTab | -1;

interface RegistrationFormContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
  highestVisitedTab: HighesVisitedTab;
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
