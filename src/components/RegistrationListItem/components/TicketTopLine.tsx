import { HorizontalBox } from '../../styled/Wrappers';
import { RegistrationStatus } from '../../../types/registration.types';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';
import { TicketTypeTag } from '../../../pages/messages/components/TicketTypeTag';
import { PublicationInstanceText } from './PublicationInstanceText';
import { DateText } from './DateText';
import { NotPublishedTag } from '../../atoms/tags/NotPublishedTag';

export const TicketTopLine = () => {
  const { registration, ticketType } = useContext(RegistrationListItemContext) ?? {};
  if (!registration || !ticketType) return null;

  const registrationStatus = registration?.recordMetadata.status;
  const isNotPublished =
    registrationStatus === RegistrationStatus.Draft || registrationStatus === RegistrationStatus.New;

  return (
    <HorizontalBox sx={{ gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
      <TicketTypeTag type={ticketType} />
      <PublicationInstanceText publicationInstanceType={registration.type} />
      {registration.publicationDate?.year && <DateText publicationDate={registration.publicationDate} />}
      {isNotPublished && <NotPublishedTag />}
    </HorizontalBox>
  );
};
