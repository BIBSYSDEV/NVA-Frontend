import { Box, List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchListItem } from '../../components/styled/Wrappers';
import { Ticket } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { Registration, RegistrationStatus, emptyRegistration } from '../../types/registration.types';
import { RegistrationListItem } from '../../components/RegistrationList';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface TicketAccordionListProps {
  tickets: Ticket[];
}

const ticketColor = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
};

export const TicketAccordionList = ({ tickets }: TicketAccordionListProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (tickets.some(({ publication }) => stringIncludesMathJax(publication.mainTitle))) {
      typesetMathJax();
    }
  }, [tickets]);

  return tickets.length === 0 ? (
    <Typography>{t('my_page.messages.no_messages')}</Typography>
  ) : (
    <List disablePadding>
      {tickets.map((ticket) => (
        <ErrorBoundary key={ticket.id}>
          <TicketListItem key={ticket.id} ticket={ticket} />
        </ErrorBoundary>
      ))}
    </List>
  );
};

interface TicketListItemProps {
  ticket: Ticket;
}

const TicketListItem = ({ ticket }: TicketListItemProps) => {
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
      <Box sx={{ width: '100%', display: 'grid', gap: '1rem', gridTemplateColumns: '5fr 2fr 1fr 1fr' }}>
        <RegistrationListItem registration={registration} />
        {ticket.type === 'PublishingRequest' ? <PublishingRequestMessagesColumn ticket={ticket} /> : <Box />}
        <Typography variant="overline">{t(`my_page.messages.ticket_types.${ticket.status}`)}</Typography>
        <Typography variant="overline">{t('common.x_days', { count: daysAge })}</Typography>
      </Box>
    </SearchListItem>
  );
};

const PublishingRequestMessagesColumn = ({ ticket }: TicketListItemProps) => {
  return (
    <>
      {ticket.publication.status === RegistrationStatus.Published ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              bgcolor: 'publishingRequest.main',
              justifyContent: 'space-evenly',
              p: '0.2rem',
            }}>
            <Typography>Metadata publisert</Typography>
            {ticket.publication.publishedDate && (
              <Typography>{new Date(ticket.publication.publishedDate).toLocaleDateString()}</Typography>
            )}
          </Box>
          {ticket.status === 'Pending' && (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                bgcolor: 'secondary.dark',
                justifyContent: 'space-evenly',
                p: '0.2rem',
              }}>
              <Typography>Filer avventer</Typography>
            </Box>
          )}
        </Box>
      ) : null}
    </>
  );
};
