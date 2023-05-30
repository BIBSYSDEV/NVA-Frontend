import { List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { ExpandedTicket } from '../../../types/publication_types/ticket.types';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';
import { TicketListItem } from './TicketListItem';

interface TicketAccordionListProps {
  tickets: ExpandedTicket[];
}

export const TicketList = ({ tickets }: TicketAccordionListProps) => {
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
