import { List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchListItem } from '../../components/styled/Wrappers';
import { Ticket } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { TicketAccordion } from './TicketAccordion';

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
    <List>
      {tickets.map((ticket) => (
        <SearchListItem key={ticket.id} sx={{ borderLeftColor: ticketColor[ticket.type] }}>
          <TicketAccordion ticket={ticket} />
        </SearchListItem>
      ))}
    </List>
  );
};
