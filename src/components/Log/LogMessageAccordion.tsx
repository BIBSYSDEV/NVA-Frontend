import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, BoxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageItem } from '../../pages/messages/components/MessageList';
import { LogEntryType } from '../../types/log.types';
import { Message } from '../../types/publication_types/ticket.types';
import { dataTestId } from '../../utils/dataTestIds';
import { logBackgroundColor } from './LogEntry';

interface LogMessageAccordionProps {
  messages: Message[];
  type: Extract<LogEntryType, 'PublishingRequest' | 'DoiRequest' | 'GeneralSupportCase'>;
}

export const LogMessageAccordion = ({ messages, type }: LogMessageAccordionProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.logPanel.logMessageAccordion}
      elevation={0}
      sx={{ mt: '0.5rem', bgcolor: logBackgroundColor[type] }}
      onChange={() => setIsExpanded(!isExpanded)}>
      <AccordionSummary>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <Typography>{isExpanded ? t('log.hide_messages') : t('log.show_messages')}</Typography>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="ul"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            listStyleType: 'none',
            p: 0,
            gap: '0.25rem',
          }}>
          {messages.map((message) => (
            <MessageItem
              key={message.identifier}
              text={message.text}
              date={message.createdDate}
              username={message.sender}
              backgroundColor={ticketMessageColor[type]}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

type TicketMessageColorType = {
  [key in Extract<LogEntryType, 'PublishingRequest' | 'DoiRequest' | 'GeneralSupportCase'>]: BoxProps['bgcolor'];
};

const ticketMessageColor: TicketMessageColorType = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
};
