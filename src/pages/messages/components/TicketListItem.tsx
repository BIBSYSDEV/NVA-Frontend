import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RegistrationListItem } from '../../../components/RegistrationList';
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

  const { id, identifier, mainTitle, contributors, publicationInstance } = ticket.publication;
  const registration: Registration = {
    ...emptyRegistration,
    identifier,
    id,
    entityDescription: emptyRegistration.entityDescription
      ? {
          ...emptyRegistration.entityDescription,
          mainTitle,
          contributors,
        }
      : undefined,
  };
  if (registration.entityDescription?.reference?.publicationInstance) {
    registration.entityDescription.reference.publicationInstance.type = publicationInstance.type;
  }

  const msAge = new Date().getTime() - new Date(ticket.modifiedDate).getTime();
  const daysAge = Math.ceil(msAge / (1000 * 3600 * 24));

  return (
    <SearchListItem
      key={ticket.id}
      sx={{
        borderLeftColor: ticket.status === 'Pending' ? ticketColor[ticket.type] : 'registration.main',
      }}>
      <Box sx={{ width: '100%', display: 'grid', gap: '1rem', gridTemplateColumns: '6fr 2fr 1fr 1fr' }}>
        <RegistrationListItem registration={registration} />
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
