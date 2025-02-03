import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { Avatar, Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogEntryType } from '../../../api/registrationApi';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { FileType } from '../../../types/associatedArtifact.types';
import { getInitials } from '../../../utils/general-helpers';
import { getFullName } from '../../../utils/user-helpers';

interface LogEntryProps {
  logEntry: LogEntryType;
}

export const LogEntry = ({ logEntry }: LogEntryProps) => {
  const { t } = useTranslation();

  const fullName = getFullName(logEntry.performedBy.givenName, logEntry.performedBy.familyName);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '0.5rem', bgcolor: 'publishingRequest.light' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LogHeaderIcon topic={logEntry.topic} />
          <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
            {logEntry.topic === 'FileApproved' && logEntry.fileType === FileType.OpenFile
              ? t('log.file_published')
              : logEntry.topic === 'FileApproved' && logEntry.fileType === FileType.InternalFile
                ? t('log.file_archived')
                : t(`log.entry_topic.${logEntry.topic}`, { defaultValue: logEntry.topic })}
          </Typography>
        </Box>
        <LogDateItem date={new Date(logEntry.timestamp)} />
      </Box>

      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mt: '0.5rem' }}>
        <Avatar
          sx={{
            height: '1.5rem',
            width: '1.5rem',
            fontSize: '0.7rem',
            bgcolor: 'primary.main',
          }}>
          {getInitials(fullName)}
        </Avatar>
        <Typography>{fullName}</Typography>

        <AccountBalanceIcon color="primary" fontSize="small" />
        <Typography>{logEntry.performedBy.onBehalfOf.displayName}</Typography>
      </Box>

      {logEntry.type === 'FileLogEntry' ? (
        <>
          <Divider sx={{ mt: '0.5rem' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mt: '0.5rem' }}>
            <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />
            <Typography sx={{ fontStyle: !logEntry.filename ? 'italic' : '', overflowWrap: 'anywhere' }}>
              {logEntry.filename || t('log.unknown_filename')}
            </Typography>
          </Box>
        </>
      ) : null}
    </Box>
  );
};

const LogHeaderIcon = ({ topic }: Pick<LogEntryType, 'topic'>) => {
  switch (topic) {
    case 'PublicationCreated':
      return <AddCircleOutlineIcon color="primary" fontSize="small" />;
    case 'PublicationPublished':
    case 'PublicationRepublished':
      return <LocalOfferOutlinedIcon color="primary" fontSize="small" />;
    case 'FileUploaded':
    case 'FileApproved':
    case 'FileRejected':
      return <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />;
    case 'PublicationUnpublished':
      return <UnpublishedOutlinedIcon color="primary" fontSize="small" />;
    case 'PublicationDeleted':
    case 'FileDeleted':
      return <DeleteOutlinedIcon color="primary" fontSize="small" />;
    default:
      return null;
  }
};
