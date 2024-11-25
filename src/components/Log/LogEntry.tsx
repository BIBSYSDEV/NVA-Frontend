import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { MessageItem } from '../../pages/messages/components/MessageList';
import { LogEntry as LogEntryType } from '../../types/log.types';
import { LogAction } from './LogAction';
import { LogHeader } from './LogHeader';

export const LogEntry = ({ title, type, modifiedDate, actions, messages }: LogEntryType) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '0.5rem', bgcolor: logBackgroundColor[type] }}>
      <LogHeader title={title} type={type} modifiedDate={modifiedDate} />
      {actions && actions.map((action, index) => <LogAction {...action} key={index} />)}
      {type === 'PublishingRequest' && !!messages && (
        <Accordion elevation={0} sx={{ mt: '0.5rem', bgcolor: '#fff0d3' }}>
          <AccordionSummary sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Typography>Vis meldinger</Typography>
              <ExpandMoreIcon />
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
      )}
    </Box>
  );
};

const logBackgroundColor = {
  PublishingRequest: 'publishingRequest.light',
  DoiRequest: 'doiRequest.light',
  GeneralSupportCase: 'generalSupportCase.light',
  Import: 'centralImport.light',
  Created: 'publishingRequest.light',
  MetadataPublished: 'publishingRequest.light',
  UnpublishRequest: 'publishingRequest.light',
  Republished: 'publishingRequest.light',
  Deleted: 'publishingRequest.light',
};
