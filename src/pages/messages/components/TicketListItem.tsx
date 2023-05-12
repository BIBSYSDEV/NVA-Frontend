import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RegistrationListItemContent } from '../../../components/RegistrationList';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { Ticket, PublishingTicket } from '../../../types/publication_types/messages.types';
import { Registration, emptyRegistration } from '../../../types/registration.types';
import { PublishingRequestMessagesColumn } from './PublishingRequestMessagesColumn';

const ticketColor = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
};

interface TicketListItemProps {
  ticket: Ticket;
}

export const TicketListItem = ({ ticket }: TicketListItemProps) => {
  const { t } = useTranslation();

  const { id, identifier, mainTitle, contributors, publicationInstance, status } = ticket.publication;
  const registrationCopy: Registration = {
    ...emptyRegistration,
    identifier,
    id,
    status,
    entityDescription: emptyRegistration.entityDescription
      ? {
          ...emptyRegistration.entityDescription,
          mainTitle,
          contributors,
        }
      : undefined,
  };
  if (registrationCopy.entityDescription?.reference?.publicationInstance) {
    registrationCopy.entityDescription.reference.publicationInstance.type = publicationInstance.type;
  }

  const msAge = new Date().getTime() - new Date(ticket.modifiedDate).getTime();
  const daysAge = Math.ceil(msAge / 86_400_000); // 1000 * 60 * 60 * 24 = 86_400_000 ms in one day

  return (
    <SearchListItem
      key={ticket.id}
      sx={{
        borderLeftColor: ticket.status === 'Pending' ? ticketColor[ticket.type] : 'registration.main',
      }}>
      <Box sx={{ width: '100%', display: 'grid', gap: '1rem', gridTemplateColumns: '6fr 2fr 1fr 1fr' }}>
        <RegistrationListItemContent registration={registrationCopy} />
        {ticket.type === 'PublishingRequest' ? (
          <PublishingRequestMessagesColumn ticket={ticket as PublishingTicket} />
        ) : (
          <Box />
        )}
        <Typography variant="overline">{t(`my_page.messages.ticket_types.${ticket.status}`)}</Typography>
        <Typography variant="overline">{t('common.x_days', { count: daysAge })}</Typography>
      </Box>
    </SearchListItem>
  );
};
