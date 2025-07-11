import { createContext, ReactNode, useState } from 'react';
import { RegistrationTab } from '../types/registration.types';

export type HighestVisitedTab = RegistrationTab | -1;

interface RegistrationFormContextType {
  disableNviCriticalFields: boolean;
  disableChannelClaimsFields: boolean;
  highestVisitedTab: HighestVisitedTab;
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
  const [highestVisitedTab, setHighestVisitedTab] = useState(value.highestVisitedTab);

  return (
    <RegistrationFormContext.Provider
      value={{
        disableNviCriticalFields: value.disableNviCriticalFields ?? false,
        disableChannelClaimsFields: value.disableChannelClaimsFields ?? false,
        highestVisitedTab,
        setHighestVisitedTab: (tab: RegistrationTab) => setHighestVisitedTab(tab),
      }}>
      {children}
    </RegistrationFormContext.Provider>
  );
};
