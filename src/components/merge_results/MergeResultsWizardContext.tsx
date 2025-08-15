import { createContext, ReactNode, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Registration, RegistrationTab } from '../../types/registration.types';

interface MergeResultsWizardContextType {
  activeTab: RegistrationTab;
  setActiveTab: (tab: RegistrationTab) => void;
  sourceResult: Registration; // Result to replace (left side)
  targetResult: Registration; // Initial values for result to merge into (right side)
  formMethods: UseFormReturn<Registration>;
}

const defaultTab = RegistrationTab.Description;

export const MergeResultsWizardContext = createContext<MergeResultsWizardContextType>({
  activeTab: defaultTab,
  setActiveTab: () => {},
  sourceResult: {} as Registration,
  targetResult: {} as Registration,
  formMethods: {} as UseFormReturn<Registration>,
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
