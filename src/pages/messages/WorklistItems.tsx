import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { TicketAccordion } from './TicketAccordion';

interface WorklistItemsProps {
  tickets: Ticket[];
}

export const WorklistItems = ({ tickets }: WorklistItemsProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (
      tickets.some(({ publicationSummary, publication }) =>
        stringIncludesMathJax(publicationSummary?.mainTitle ?? publication?.mainTitle)
      )
    ) {
      typesetMathJax();
    }
  }, [tickets]);

  return tickets.length === 0 ? (
    <Typography>{t('worklist.no_messages')}</Typography>
  ) : (
    <>
      {tickets.map((ticket, index) => (
        <TicketAccordion key={index} ticket={ticket} />
      ))}
    </>
  );
};
