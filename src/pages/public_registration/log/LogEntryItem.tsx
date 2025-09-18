import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import BlockIcon from '@mui/icons-material/Block';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { Avatar, Box, Divider, styled, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { FileType } from '../../../types/associatedArtifact.types';
import { FileLogEntry, LogEntry, LogEntryOrganization, LogEntryPerson } from '../../../types/log.types';
import { Message } from '../../../types/publication_types/ticket.types';
import { getInitials } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getFullName } from '../../../utils/user-helpers';
import { LogDateItem } from './LogDateItem';
import { LogEntryImportSourceInfo } from './LogEntryImportSourceInfo';
import { LogMessageAccordion } from './LogMessageAccordion';

const logIconProps: SvgIconProps = { color: 'primary', fontSize: 'small' };

const StyledLogRow = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

interface LogEntryItemProps {
  logEntry: LogEntry;
  messages: Message[];
}

export const LogEntryItem = ({ logEntry, messages }: LogEntryItemProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '0.5rem',
        bgcolor: 'white',
        gap: '0.5rem',
      }}>
      <StyledLogRow>
        <LogHeaderIcon topic={logEntry.topic} />
        <Typography variant="h3">{getLogEntryTitle(logEntry, t)}</Typography>
      </StyledLogRow>
      <LogDateItem date={logEntry.timestamp} />

      {logEntry.performedBy.type === 'Person' ? (
        <LogEntryPersonInfo performedBy={logEntry.performedBy} />
      ) : logEntry.performedBy.type === 'Organization' ? (
        <LogEntryOganizationInfo performedBy={logEntry.performedBy} />
      ) : null}

      {logEntry.type === 'FileLogEntry' ? (
        <>
          <Divider />
          <StyledLogRow>
            <InsertDriveFileOutlinedIcon {...logIconProps} />
            <Typography sx={{ fontStyle: !logEntry.filename ? 'italic' : '', overflowWrap: 'anywhere' }}>
              {logEntry.filename || t('log.unknown_filename')}
            </Typography>
          </StyledLogRow>
          {logEntry.topic === 'FileImported' && <LogEntryImportSourceInfo importSource={logEntry.importSource} />}
        </>
      ) : logEntry.topic === 'PublicationImported' || logEntry.topic === 'PublicationMerged' ? (
        <>
          <Divider />
          <LogEntryImportSourceInfo importSource={logEntry.importSource} />
        </>
      ) : null}

      {messages && messages.length > 0 && <LogMessageAccordion messages={messages} topic={logEntry.topic} />}
    </Box>
  );
};

const LogEntryPersonInfo = ({ performedBy }: { performedBy: LogEntryPerson }) => {
  const fullName = getFullName(performedBy.givenName, performedBy.familyName);
  return (
    <StyledLogRow>
      {fullName && (
        <>
          <Avatar sx={{ height: '1.5rem', width: '1.5rem', fontSize: '0.7rem', bgcolor: 'primary.main' }}>
            {getInitials(fullName)}
          </Avatar>
          <Typography>{fullName}</Typography>
        </>
      )}

      {performedBy.onBehalfOf && <LogEntryOganizationInfo performedBy={performedBy.onBehalfOf} />}
    </StyledLogRow>
  );
};

const LogEntryOganizationInfo = ({ performedBy }: { performedBy: LogEntryOrganization }) => {
  if (!performedBy.acronym) {
    return null;
  }
  return (
    <StyledLogRow>
      <AccountBalanceIcon {...logIconProps} />
      <Tooltip title={getLanguageString(performedBy.labels)}>
        <Typography>{performedBy.acronym}</Typography>
      </Tooltip>
    </StyledLogRow>
  );
};

const LogHeaderIcon = ({ topic }: Pick<LogEntry, 'topic'>) => {
  switch (topic) {
    case 'PublicationCreated':
      return <AddCircleOutlineIcon {...logIconProps} />;
    case 'PublicationUpdated':
    case 'PublicationPublished':
    case 'PublicationRepublished':
      return <LocalOfferOutlinedIcon {...logIconProps} />;
    case 'PublicationUnpublished':
      return <BlockIcon {...logIconProps} />;
    case 'FileUploaded':
    case 'FileApproved':
    case 'FileRejected':
    case 'FileImported':
    case 'FileRetracted':
    case 'FileHidden':
    case 'FileTypeUpdated':
    case 'FileTypeUpdatedByImport':
      return <InsertDriveFileOutlinedIcon {...logIconProps} />;
    case 'PublicationDeleted':
    case 'FileDeleted':
      return <DeleteOutlinedIcon {...logIconProps} />;
    case 'PublicationImported':
    case 'PublicationMerged':
      return <CloudOutlinedIcon {...logIconProps} />;
    case 'DoiReserved':
    case 'DoiRequested':
    case 'DoiRejected':
    case 'DoiAssigned':
      return <AddLinkOutlinedIcon {...logIconProps} />;
    default:
      return null;
  }
};

const getLogEntryTitle = (logEntry: LogEntry, t: TFunction) => {
  switch (logEntry.topic) {
    case 'PublicationCreated':
      return t('log.titles.result_created');
    case 'PublicationUpdated':
      return t('log.titles.result_updated');
    case 'PublicationPublished':
    case 'PublicationImported':
      return t('log.titles.result_published');
    case 'PublicationMerged':
      return t('log.titles.result_merged');
    case 'PublicationRepublished':
      return t('log.titles.result_republished');
    case 'PublicationUnpublished':
      return t('log.titles.result_unpublished');
    case 'PublicationDeleted':
      return t('log.titles.result_deleted');
    case 'DoiReserved':
      return t('log.titles.doi_reserved');
    case 'DoiRequested':
      return t('log.titles.doi_requested');
    case 'DoiRejected':
      return t('log.titles.doi_rejected');
    case 'DoiAssigned':
      return t('log.titles.doi_given');
    case 'FileUploaded':
      return t('log.titles.files_uploaded', { count: 1 });
    case 'FileApproved':
    case 'FileImported':
      switch (logEntry.fileType) {
        case FileType.OpenFile:
          return t('log.open_file_published');
        case FileType.InternalFile:
          return t('log.internal_file_approved');
        case FileType.HiddenFile:
          return t('log.titles.file_hidden');
      }
      break;
    case 'FileTypeUpdated':
    case 'FileTypeUpdatedByImport':
      return getFileTypeUpdatedString(t, logEntry);
    case 'FileRejected':
      return t('log.titles.files_rejected', { count: 1 });
    case 'FileDeleted':
      return t('log.titles.file_deleted');
    case 'FileRetracted':
      return t('log.titles.file_retracted');
    case 'FileHidden':
      return t('log.titles.file_hidden');
    default:
      return (logEntry as any).topic;
  }
};

const getFileTypeUpdatedString = (t: TFunction, logEntry: FileLogEntry) => {
  const newFileTypeString =
    logEntry.fileType === 'PendingOpenFile' || logEntry.fileType === 'OpenFile'
      ? t('registration.files_and_license.file_type.open_file')
      : logEntry.fileType === 'PendingInternalFile' || logEntry.fileType === 'InternalFile'
        ? t('registration.files_and_license.file_type.internal_file')
        : logEntry.fileType;

  return t('log.titles.file_type_updated', { newFileType: newFileTypeString.toLocaleLowerCase() });
};
