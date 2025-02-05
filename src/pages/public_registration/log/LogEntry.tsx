import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { Avatar, Box, Divider, SvgIconProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogEntryType } from '../../../api/registrationApi';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { FileType } from '../../../types/associatedArtifact.types';
import { getInitials } from '../../../utils/general-helpers';
import { getFullName } from '../../../utils/user-helpers';

const logIconProps: SvgIconProps = { color: 'primary', fontSize: 'small' };

interface LogEntryProps {
  logEntry: LogEntryType;
}

export const LogEntry = ({ logEntry }: LogEntryProps) => {
  const { t } = useTranslation();

  const fullName = getFullName(logEntry.performedBy.givenName, logEntry.performedBy.familyName);
  const initials = getInitials(fullName);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', p: '0.5rem', bgcolor: 'publishingRequest.light', gap: '0.5rem' }}>
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

      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Avatar sx={{ height: '1.5rem', width: '1.5rem', fontSize: '0.7rem', bgcolor: 'primary.main' }}>
          {initials}
        </Avatar>
        <Typography>{fullName}</Typography>

        <AccountBalanceIcon {...logIconProps} />
        <Typography>{logEntry.performedBy.onBehalfOf.displayName}</Typography>
      </Box>

      {logEntry.type === 'FileLogEntry' ? (
        <>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <InsertDriveFileOutlinedIcon {...logIconProps} />
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
      return <AddCircleOutlineIcon {...logIconProps} />;
    case 'PublicationPublished':
    case 'PublicationRepublished':
      return <LocalOfferOutlinedIcon {...logIconProps} />;
    case 'FileUploaded':
    case 'FileApproved':
    case 'FileRejected':
      return <InsertDriveFileOutlinedIcon {...logIconProps} />;
    case 'PublicationUnpublished':
      return <UnpublishedOutlinedIcon {...logIconProps} />;
    case 'PublicationDeleted':
    case 'FileDeleted':
      return <DeleteOutlinedIcon {...logIconProps} />;
    default:
      return null;
  }
};
