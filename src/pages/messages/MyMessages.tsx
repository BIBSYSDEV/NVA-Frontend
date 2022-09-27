import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../types/publication_types/messages.types';
import { stringIncludesMathJax, typesetMathJax } from '../../utils/mathJaxHelpers';
import { SupportRequestAccordion } from './SupportRequestAccordion';

interface MyMessagesProps {
  tickets: Ticket[];
}

export const MyMessages = ({ tickets }: MyMessagesProps) => {
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
    <Typography>{t('my_page.messages.no_messages')}</Typography>
  ) : (
    <>
      {tickets.map((ticket, index) => (
        <SupportRequestAccordion key={index} ticket={ticket} />
      ))}
    </>
  );
};
