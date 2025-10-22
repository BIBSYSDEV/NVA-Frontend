import { HorizontalBox } from '../../styled/Wrappers';
import { PublishingRequestTag } from '../../../pages/messages/components/TicketTypeTags/PublishingRequestTag';
import { NotPublishedTag } from '../../atoms/NotPublishedTag';
import { RegistrationStatus } from '../../../types/registration.types';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';

export const TicketTopLine = () => {
  const { registration } = useContext(RegistrationListItemContext) ?? {};
  if (!registration) return null;

  const registrationStatus = registration?.recordMetadata.status;
  const isNotPublished =
    registrationStatus === RegistrationStatus.Draft || registrationStatus === RegistrationStatus.New;

  return (
    <HorizontalBox sx={{ gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
      <PublishingRequestTag />
      {isNotPublished && <NotPublishedTag />}
    </HorizontalBox>
  );
};
