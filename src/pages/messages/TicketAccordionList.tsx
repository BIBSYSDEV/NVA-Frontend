import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { TicketAccordion } from './TicketAccordion';

interface TicketAccordionListProps {
  tickets: Ticket[];
}

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
    <>
      {tickets.map((ticket) => (
        <TicketAccordion key={ticket.id} ticket={ticket} />
      ))}
    </>
  );
};
