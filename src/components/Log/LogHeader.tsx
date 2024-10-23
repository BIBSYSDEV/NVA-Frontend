import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
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
    <AvatarMui sx={{ mr: '0.5rem', bgcolor: iconBackgroundColor[type] }} alt={t('log.header_icon', { type: type })}>
      {type === 'PublishingRequest' ? (
        <InsertDriveFileOutlinedIcon color="primary" />
      ) : type === 'DoiRequest' ? (
        <AddLinkOutlinedIcon color="primary" />
      ) : type === 'Import' ? (
        <CloudOutlinedIcon color="primary" />
      ) : type === 'Created' ? (
        <AddRoundedIcon color="secondary" />
      ) : type === 'MetadataPublished' ? (
        <LocalOfferOutlinedIcon color="primary" />
      ) : type === 'Republished' || type === 'UnpublishRequest' ? (
        <NotesIcon color="primary" />
      ) : type === 'Deleted' ? (
        <DeleteOutlineIcon color="primary" />
      ) : undefined}
    </AvatarMui>
  );
};

const iconBackgroundColor = {
  PublishingRequest: 'publishingRequest.main',
  DoiRequest: 'doiRequest.main',
  GeneralSupportCase: 'generalSupportCase.main',
  Import: 'centralImport.main',
  Created: 'primary.light',
  MetadataPublished: 'publishingRequest.main',
  UnpublishRequest: 'publishingRequest.main',
  Republished: 'publishingRequest.main',
  Deleted: 'publishingRequest.main',
};
