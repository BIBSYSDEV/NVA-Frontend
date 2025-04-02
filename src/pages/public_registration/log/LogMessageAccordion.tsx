import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, BoxProps, Button, Collapse, Divider } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { LogEntry } from '../../../types/log.types';
import { Message, TicketType } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanDeleteMessage } from '../../../utils/user-helpers';
import { MessageItem } from '../../messages/components/MessageList';
import { MessageMenu } from '../../messages/components/MessageMenu';

interface LogMessageAccordionProps {
  messages: Message[];
  messageBackgroundColor: BoxProps['bgcolor'];
  refetchData?: () => void;
  topic: LogEntry['topic'];
}

export const LogMessageAccordion = ({
  messages,
  messageBackgroundColor,
  refetchData,
  topic,
}: LogMessageAccordionProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useSelector((store: RootState) => store.user);

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
          {messages.map((message) => {
            const messageType = getTicketTypeFromLogEntryTopic(topic);
            const canDeleteMessage = !!user && userCanDeleteMessage(user, message, messageType);
            return (
              <MessageItem
                key={message.identifier}
                text={message.text}
                date={message.createdDate}
                username={message.sender}
                backgroundColor={messageBackgroundColor}
                menuElement={
                  canDeleteMessage && (
                    <MessageMenu messageId={message.id} refetchData={refetchData} disableDelete={!!message.text} />
                  )
                }
              />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const getTicketTypeFromLogEntryTopic = (topic: LogEntry['topic']): TicketType => {
  switch (topic) {
    case 'DoiRequested':
    case 'DoiRejected':
    case 'DoiAssigned':
      return 'DoiRequest';
    default:
      return 'PublishingRequest';
  }
};
