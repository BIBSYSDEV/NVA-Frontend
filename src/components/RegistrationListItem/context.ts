import { RegistrationSearchItem } from '../../types/registration.types';
import { createContext } from 'react';

interface RegistrationListItemContextType {
  registration: RegistrationSearchItem | undefined;
}

export const RegistrationListItemContext = createContext<RegistrationListItemContextType | undefined>(undefined);
