import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, BoxProps, Button, Collapse, Divider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageItem } from '../../pages/messages/components/MessageList';
import { LogEntryType } from '../../types/log.types';
import { Message } from '../../types/publication_types/ticket.types';
import { dataTestId } from '../../utils/dataTestIds';

interface LogMessageAccordionProps {
  messages: Message[];
  type: LogEntryType;
}

export const LogMessageAccordion = ({ messages, type }: LogMessageAccordionProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box sx={{ mt: '1rem' }}>
      <Divider />
      <Button
        data-testid={dataTestId.registrationLandingPage.logPanel.logMessageButton}
        size="small"
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ width: '100%', mt: '0.5rem' }}
        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
        {isExpanded ? t('log.hide_messages') : t('log.show_messages')}
      </Button>
      <Collapse in={isExpanded}>
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
              backgroundColor={ticketMessageColor[type] ?? 'secondary.main'}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

const ticketMessageColor: { [key: string]: BoxProps['bgcolor'] } = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
};
