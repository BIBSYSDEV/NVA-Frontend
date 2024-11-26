import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageItem } from '../../pages/messages/components/MessageList';
import { Message } from '../../types/publication_types/ticket.types';

interface LogMessageAccordionProps {
  messages: Message[];
}

export const LogMessageAccordion = ({ messages }: LogMessageAccordionProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Accordion
      elevation={0}
      sx={{ mt: '0.5rem', bgcolor: 'publishingRequest.light' }}
      onClick={() => setIsExpanded(!isExpanded)}>
      <AccordionSummary sx={{ width: '100%' }}>
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
            m: 0,
            gap: '0.25rem',
          }}>
          {messages.map((message) => (
            <MessageItem
              key={message.identifier}
              text={message.text}
              date={message.createdDate}
              username={message.sender}
              backgroundColor={'publishingRequest.main'}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
