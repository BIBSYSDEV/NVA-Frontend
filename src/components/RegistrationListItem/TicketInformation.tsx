import { RegistrationSearchItem } from '../../types/registration.types';
import RegistrationListItem from './RegistrationListItem';
import { TicketType } from '../../types/publication_types/ticket.types';

interface RegistrationInformationProps {
  registration: RegistrationSearchItem;
  ticketType: TicketType;
}

export const TicketInformation = ({ registration, ticketType }: RegistrationInformationProps) => {
  return (
    <RegistrationListItem registration={registration} ticketType={ticketType}>
      <RegistrationListItem.TicketTopLine />
      <RegistrationListItem.Title />
      <RegistrationListItem.Contributors />
      {(registration.abstract || registration.description) && <RegistrationListItem.TextPreview />}
    </RegistrationListItem>
  );
};
