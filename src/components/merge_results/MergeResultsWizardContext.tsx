import { createContext, ReactNode, useState } from 'react';
import { RegistrationTab } from '../../types/registration.types';

interface MergeResultsWizardContextType {
  activeTab: RegistrationTab;
  setActiveTab: (tab: RegistrationTab) => void;
}

export const MergeResultsWizardContext = createContext<MergeResultsWizardContextType>({
  activeTab: RegistrationTab.Description,
  setActiveTab: () => {},
});

interface RegistrationFormContextProviderProps {
  children: ReactNode;
  value?: Omit<MergeResultsWizardContextType, 'setActiveTab' | 'activeTab'>;
}

export const MergeResultsWizardContextContextProvider = ({ children, value }: RegistrationFormContextProviderProps) => {
  const [activeTab, setActiveTab] = useState(RegistrationTab.Description);

  return (
    <MergeResultsWizardContext.Provider value={{ activeTab, setActiveTab, ...value }}>
      {children}
    </MergeResultsWizardContext.Provider>
  );
};
