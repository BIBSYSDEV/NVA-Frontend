import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddLinkOutlinedIcon from '@mui/icons-material/AddLinkOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import NotesIcon from '@mui/icons-material/Notes';
import { Box, Typography } from '@mui/material';
import { LogEntry as LogEntryType } from '../../types/log.types';
import { toDateStringWithTime } from '../../utils/date-helpers';

export const LogHeader = ({ title, type, modifiedDate }: Pick<LogEntryType, 'title' | 'type' | 'modifiedDate'>) => {
  const date = new Date(modifiedDate);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <LogHeaderIcon type={type} />
        <Typography sx={{ fontWeight: 900, fontSize: '1rem' }}>{title}</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        <CalendarMonthIcon color="primary" fontSize="small" />
        <Typography>{toDateStringWithTime(date)}</Typography>
      </Box>
    </Box>
  );
};

const LogHeaderIcon = ({ type }: Pick<LogEntryType, 'type'>) => {
  return type === 'PublishingRequest' ? (
    <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />
  ) : type === 'DoiRequest' ? (
    <AddLinkOutlinedIcon color="primary" fontSize="small" />
  ) : type === 'Import' ? (
    <CloudOutlinedIcon color="primary" fontSize="small" />
  ) : type === 'Created' ? (
    <AddCircleOutlineIcon color="primary" />
  ) : type === 'MetadataPublished' ? (
    <LocalOfferOutlinedIcon color="primary" fontSize="small" />
  ) : type === 'UnpublishRequest' || type === 'Republished' ? (
    <NotesIcon color="primary" fontSize="small" />
  ) : type === 'Deleted' ? (
    <DeleteOutlineIcon color="primary" fontSize="small" />
  ) : undefined;
};
