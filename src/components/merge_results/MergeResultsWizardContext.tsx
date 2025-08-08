import { createContext, ReactNode, useState } from 'react';
import { Registration, RegistrationTab } from '../../types/registration.types';

interface MergeResultsWizardContextType {
  activeTab: RegistrationTab;
  setActiveTab: (tab: RegistrationTab) => void;
  sourceResult: Registration; // Result to replace (left side)
  targetResult: Registration; // Result to merge into (right side)
}

const defaultTab = RegistrationTab.Description;

export const MergeResultsWizardContext = createContext<MergeResultsWizardContextType>({
  activeTab: defaultTab,
  setActiveTab: () => {},
  sourceResult: {} as Registration,
  targetResult: {} as Registration,
});

interface RegistrationFormContextProviderProps {
  children: ReactNode;
  value: Omit<MergeResultsWizardContextType, 'setActiveTab' | 'activeTab'>;
}

export const MergeResultsWizardContextProvider = ({ children, value }: RegistrationFormContextProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <MergeResultsWizardContext.Provider value={{ activeTab, setActiveTab, ...value }}>
      {children}
    </MergeResultsWizardContext.Provider>
  );
};
