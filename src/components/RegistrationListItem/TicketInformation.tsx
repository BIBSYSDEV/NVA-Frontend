import { RegistrationSearchItem } from '../../types/registration.types';
import RegistrationListItem from './RegistrationListItem';

interface RegistrationInformationProps {
  registration: RegistrationSearchItem;
}

export const TicketInformation = ({ registration }: RegistrationInformationProps) => {
  return (
    <RegistrationListItem registration={registration}>
      <RegistrationListItem.TicketTopLine />
      <RegistrationListItem.Title />
      <RegistrationListItem.Contributors />
      {(registration.abstract || registration.description) && <RegistrationListItem.TextPreview />}
    </RegistrationListItem>
  );
};
