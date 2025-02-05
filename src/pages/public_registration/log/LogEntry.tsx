import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { Avatar, Box, Divider, styled, SvgIconProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogEntryType } from '../../../api/registrationApi';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { FileType } from '../../../types/associatedArtifact.types';
import { getInitials } from '../../../utils/general-helpers';
import { getFullName } from '../../../utils/user-helpers';

const logIconProps: SvgIconProps = { color: 'primary', fontSize: 'small' };

const StyledLogRow = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

interface LogEntryProps {
  logEntry: LogEntryType;
}

export const LogEntry = ({ logEntry }: LogEntryProps) => {
  const { t } = useTranslation();

  const fullName = logEntry.performedBy
    ? getFullName(logEntry.performedBy.givenName, logEntry.performedBy.familyName)
    : '';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '0.5rem',
        bgcolor: getLogEntryBackgroundColor(logEntry.topic),
        gap: '0.5rem',
      }}>
      <StyledLogRow>
        <LogHeaderIcon topic={logEntry.topic} />
        <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>
          {logEntry.topic === 'FileApproved' && logEntry.fileType === FileType.OpenFile
            ? t('log.file_published')
            : logEntry.topic === 'FileApproved' && logEntry.fileType === FileType.InternalFile
              ? t('log.file_archived')
              : t(`log.entry_topic.${logEntry.topic}`, { defaultValue: logEntry.topic })}
        </Typography>
      </StyledLogRow>
      <LogDateItem date={new Date(logEntry.timestamp)} />

      {logEntry.performedBy && (
        <StyledLogRow>
          <Avatar sx={{ height: '1.5rem', width: '1.5rem', fontSize: '0.7rem', bgcolor: 'primary.main' }}>
            {getInitials(fullName)}
          </Avatar>
          <Typography>{fullName}</Typography>

          <AccountBalanceIcon {...logIconProps} />
          <Typography>{logEntry.performedBy.onBehalfOf.displayName}</Typography>
        </StyledLogRow>
      )}

      {logEntry.type === 'FileLogEntry' ? (
        <>
          <Divider />
          <StyledLogRow>
            <InsertDriveFileOutlinedIcon {...logIconProps} />
            <Typography sx={{ fontStyle: !logEntry.filename ? 'italic' : '', overflowWrap: 'anywhere' }}>
              {logEntry.filename || t('log.unknown_filename')}
            </Typography>
          </StyledLogRow>
        </>
      ) : logEntry.topic === 'PublicationImported' ? (
        <>
          <Divider />
          <Typography>
            {logEntry.source.importSource.archive
              ? t('log.imported_from_source_and_archive', {
                  source: logEntry.source.importSource.source,
                  archive: logEntry.source.importSource.archive,
                })
              : t('log.imported_from_source', {
                  source: logEntry.source.importSource.source,
                })}
          </Typography>
        </>
      ) : null}
    </Box>
  );
};

const getLogEntryBackgroundColor = (topic: LogEntryType['topic']) => {
  switch (topic) {
    case 'PublicationImported':
      return 'centralImport.light';
    default:
      return 'publishingRequest.light';
  }
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
    case 'PublicationImported':
      return <CloudOutlinedIcon {...logIconProps} />;
    default:
      return null;
  }
};
