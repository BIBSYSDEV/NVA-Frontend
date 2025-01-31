import { Box, Typography } from '@mui/material';
import { LogEntryType } from '../../../api/registrationApi';
import { LogAction } from '../../../components/Log/LogAction';
import { LogHeader } from '../../../components/Log/LogHeader';

interface LogEntryProps {
  logEntry: LogEntryType;
}

export const LogEntry = ({ logEntry }: LogEntryProps) => {
  console.log(logEntry.performedBy);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '0.5rem', bgcolor: 'publishingRequest.light' }}>
      <LogHeader title={logEntry.topic} type="PublishingRequest" modifiedDate={logEntry.timestamp} />
      <LogAction
        actor={logEntry.performedBy.userName}
        organization={logEntry.performedBy.onBehalfOf.topLevelOrgCristinId}
        items={[]}
      />

      <Typography>
        {logEntry.type} : {logEntry.topic}
      </Typography>
    </Box>
  );
};
