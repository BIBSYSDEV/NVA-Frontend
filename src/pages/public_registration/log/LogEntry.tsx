import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import { Avatar, Box, Divider, styled, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { LogDateItem } from '../../../components/Log/LogDateItem';
import { LogMessageAccordion } from '../../../components/Log/LogMessageAccordion';
import { FileType } from '../../../types/associatedArtifact.types';
import { ImportSourceLogData, LogEntryObject } from '../../../types/log.types';
import { Message } from '../../../types/publication_types/ticket.types';
import { getInitials } from '../../../utils/general-helpers';
import { getFullName } from '../../../utils/user-helpers';

const logIconProps: SvgIconProps = { color: 'primary', fontSize: 'small' };

const StyledLogRow = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

interface LogEntryProps {
  logEntry: LogEntryObject;
  messages: Message[];
}

export const LogEntry = ({ logEntry, messages }: LogEntryProps) => {
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
        <Typography variant="h3">{getLogEntryTitle(logEntry, t)}</Typography>
      </StyledLogRow>
      <LogDateItem date={new Date(logEntry.timestamp)} />

      {(fullName || logEntry.performedBy?.onBehalfOf.shortName) && (
        <StyledLogRow>
          {fullName && (
            <>
              <Avatar sx={{ height: '1.5rem', width: '1.5rem', fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                {getInitials(fullName)}
              </Avatar>
              <Typography>{fullName}</Typography>
            </>
          )}

          {logEntry.performedBy?.onBehalfOf.shortName && (
            <>
              <AccountBalanceIcon {...logIconProps} />
              <Tooltip title={logEntry.performedBy.onBehalfOf.displayName}>
                <Typography>{logEntry.performedBy.onBehalfOf.shortName}</Typography>
              </Tooltip>
            </>
          )}
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
          {logEntry.topic === 'FileImported' && <ImportSourceInfo importSource={logEntry.importSource} />}
        </>
      ) : logEntry.topic === 'PublicationImported' || logEntry.topic === 'PublicationMerged' ? (
        <>
          <Divider />
          <ImportSourceInfo importSource={logEntry.importSource} />
        </>
      ) : null}

      {messages && messages.length > 0 && <LogMessageAccordion messages={messages} type={'PublishingRequest'} />}
    </Box>
  );
};

const ImportSourceInfo = ({ importSource }: { importSource: ImportSourceLogData }) => {
  const { t } = useTranslation();

  return (
    <Typography>
      {importSource.archive
        ? t('log.imported_from_source_and_archive', {
            source: importSource.source,
            archive: importSource.archive,
          })
        : t('log.imported_from_source', {
            source: importSource.source,
          })}
    </Typography>
  );
};

const getLogEntryBackgroundColor = (topic: LogEntryObject['topic']) => {
  switch (topic) {
    case 'PublicationImported':
    case 'FileImported':
    case 'PublicationMerged':
      return 'centralImport.light';
    case 'DoiReserved':
    case 'DoiRequested':
    case 'DoiRejected':
    case 'DoiAssigned':
      return 'doiRequest.light';
    default:
      return 'publishingRequest.light';
  }
};

const LogHeaderIcon = ({ topic }: Pick<LogEntryObject, 'topic'>) => {
  switch (topic) {
    case 'PublicationCreated':
      return <AddCircleOutlineIcon {...logIconProps} />;
    case 'PublicationPublished':
    case 'PublicationRepublished':
      return <LocalOfferOutlinedIcon {...logIconProps} />;
    case 'FileUploaded':
    case 'FileApproved':
    case 'FileRejected':
    case 'FileImported':
    case 'FileRetracted':
    case 'FileHidden':
      return <InsertDriveFileOutlinedIcon {...logIconProps} />;
    case 'PublicationUnpublished':
      return <UnpublishedOutlinedIcon {...logIconProps} />;
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

const getLogEntryTitle = (logEntry: LogEntryObject, t: TFunction) => {
  switch (logEntry.topic) {
    case 'PublicationCreated':
      return t('log.titles.result_created');
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
