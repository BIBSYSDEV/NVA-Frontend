import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, BoxProps, Button, Collapse, Divider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { MessageItem } from '../../messages/components/MessageList';

interface LogMessageAccordionProps {
  messages: Message[];
  messageBackgroundColor: BoxProps['bgcolor'];
}

export const LogMessageAccordion = ({ messages, messageBackgroundColor }: LogMessageAccordionProps) => {
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
              backgroundColor={messageBackgroundColor}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};
