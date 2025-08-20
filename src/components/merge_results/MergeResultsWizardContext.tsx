import { createContext, ReactNode, useState } from 'react';
import { Registration, RegistrationTab } from '../../types/registration.types';

interface MergeResultsWizardContextType {
  activeTab: RegistrationTab;
  setActiveTab: (tab: RegistrationTab) => void;
  sourceResult: Registration;
}

const defaultTab = RegistrationTab.Description;

export const MergeResultsWizardContext = createContext<MergeResultsWizardContextType>({
  activeTab: defaultTab,
  setActiveTab: () => {},
  sourceResult: {} as Registration,
});

interface RegistrationFormContextProviderProps {
  children: ReactNode;
  value: Pick<MergeResultsWizardContextType, 'sourceResult'>;
}

export const MergeResultsWizardContextProvider = ({ children, value }: RegistrationFormContextProviderProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <MergeResultsWizardContext.Provider value={{ activeTab, setActiveTab, ...value }}>
      {children}
    </MergeResultsWizardContext.Provider>
  );
};
