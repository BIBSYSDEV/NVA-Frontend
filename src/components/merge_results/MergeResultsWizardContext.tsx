import { createContext, ReactNode, useState } from 'react';
import { Registration, RegistrationTab } from '../../types/registration.types';

interface MergeResultsWizardContextType {
  activeTab: RegistrationTab;
  setActiveTab: (tab: RegistrationTab) => void;
  sourceResult: Registration; // Result to replace (left side)
  targetResult: Registration; // Result to merge into (right side)
}

export const MergeResultsWizardContext = createContext<MergeResultsWizardContextType>({
  activeTab: RegistrationTab.Description,
  setActiveTab: () => {},
  sourceResult: {} as Registration,
  targetResult: {} as Registration,
});

interface RegistrationFormContextProviderProps {
  children: ReactNode;
  value: Omit<MergeResultsWizardContextType, 'setActiveTab' | 'activeTab'>;
}

export const MergeResultsWizardContextContextProvider = ({ children, value }: RegistrationFormContextProviderProps) => {
  const [activeTab, setActiveTab] = useState(RegistrationTab.Description);

  return (
    <MergeResultsWizardContext.Provider value={{ activeTab, setActiveTab, ...value }}>
      {children}
    </MergeResultsWizardContext.Provider>
  );
};
