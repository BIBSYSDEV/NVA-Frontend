import {
  AddLinkOutlined,
  AddRounded,
  CloudOutlined,
  InsertDriveFileOutlined,
  LocalOfferOutlined,
} from '@mui/icons-material';
import NotesIcon from '@mui/icons-material/Notes';
import { Avatar as AvatarMui, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogEntry as LogEntryType } from '../../types/log.types';
import { toDateStringWithTime } from '../../utils/date-helpers';

export const LogHeader = ({ title, type, modifiedDate }: Pick<LogEntryType, 'title' | 'type' | 'modifiedDate'>) => {
  const date = new Date(modifiedDate);
  return (
    <Box sx={{ display: 'flex' }}>
      <LogHeaderIcon type={type} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography fontWeight={900}>{title.toUpperCase()}</Typography>
        <Typography>{toDateStringWithTime(date)}</Typography>
      </Box>
    </Box>
  );
};

const LogHeaderIcon = ({ type }: Pick<LogEntryType, 'type'>) => {
  const { t } = useTranslation();
  return (
    <AvatarMui sx={{ mr: '0.5rem' }} alt={t('log.header_icon', { type: type })}>
      {type === 'PublishingRequest' ? (
        <InsertDriveFileOutlined color="primary" />
      ) : type === 'DoiRequest' ? (
        <AddLinkOutlined color="primary" />
      ) : type === 'Import' ? (
        <CloudOutlined color="primary" />
      ) : type === 'Created' ? (
        <AddRounded color="secondary" />
      ) : type === 'MetadataPublished' ? (
        <LocalOfferOutlined color="primary" />
      ) : type === 'Unpublished' || type === 'Republished' ? (
        <NotesIcon color="primary" />
      ) : undefined}
    </AvatarMui>
  );
};
