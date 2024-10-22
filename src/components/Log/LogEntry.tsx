import { Box } from '@mui/material';
import { LogEntry as LogEntryType } from '../../types/log.types';
import { LogAction } from './LogAction';
import { LogHeader } from './LogHeader';

export const LogEntry = ({ title, type, modifiedDate, actions }: LogEntryType) => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', p: '0.5rem', bgcolor: logBackgroundColor[type] }}>
      <LogHeader title={title} type={type} modifiedDate={modifiedDate} />
      {actions && actions.map((action, index) => <LogAction {...action} key={index} />)}
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
  Unpublished: 'publishingRequest.light',
  Republished: 'publishingRequest.light',
};
