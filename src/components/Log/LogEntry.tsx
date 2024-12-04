import { Box } from '@mui/material';
import { LogEntry as LogEntryType } from '../../types/log.types';
import { LogAction } from './LogAction';
import { LogHeader } from './LogHeader';
import { LogMessageAccordion } from './LogMessageAccordion';

export const LogEntry = ({ title, type, modifiedDate, actions, messages }: LogEntryType) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '0.5rem', bgcolor: logBackgroundColor[type] }}>
      <LogHeader title={title} type={type} modifiedDate={modifiedDate} />
      {actions && actions.map((action, index) => <LogAction {...action} key={index} />)}
      {messages && messages.length > 0 && <LogMessageAccordion messages={messages} type={type} />}
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
