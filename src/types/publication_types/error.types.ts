import { RegistrationTab } from '../registration.types';

export interface ErrorSummary {
  field: string;
  message: string;
}

export interface TabErrors {
  [RegistrationTab.Description]: ErrorSummary[];
  [RegistrationTab.ResourceType]: ErrorSummary[];
  [RegistrationTab.Contributors]: ErrorSummary[];
  [RegistrationTab.FilesAndLicenses]: ErrorSummary[];
}

export const validTabs: TabErrors = {
  [RegistrationTab.Description]: [],
  [RegistrationTab.ResourceType]: [],
  [RegistrationTab.Contributors]: [],
  [RegistrationTab.FilesAndLicenses]: [],
};
