import { RegistrationTab } from '../registration.types';

export interface TabErrors {
  [RegistrationTab.Description]: string[];
  [RegistrationTab.ResourceType]: string[];
  [RegistrationTab.Contributors]: string[];
  [RegistrationTab.FilesAndLicenses]: string[];
}
