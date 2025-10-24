import { RegistrationSearchItem } from '../../types/registration.types';
import { createContext } from 'react';
import { TicketType } from '../../types/publication_types/ticket.types';

interface RegistrationListItemContextType {
  registration: RegistrationSearchItem | undefined;
  ticketType: TicketType | undefined;
}

export const RegistrationListItemContext = createContext<RegistrationListItemContextType>({
  registration: undefined,
  ticketType: undefined,
});
