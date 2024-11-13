import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DoNotDisturbOutlinedIcon from '@mui/icons-material/DoNotDisturbOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import InsertPageBreakOutlinedIcon from '@mui/icons-material/InsertPageBreakOutlined';
import { Box, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogActionItem as LogActionItemType } from '../../types/log.types';
import { toDateString } from '../../utils/date-helpers';

export const LogActionItem = ({ description, date, fileIcon }: LogActionItemType) => {
  const { t } = useTranslation();
  const itemIsFile = !!fileIcon;
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: '0.5rem',
          alignItems: 'center',
          gridColumn: date ? undefined : 'span 2',
        }}>
        {fileIcon && <LogActionItemIcon fileIcon={fileIcon} />}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          {itemIsFile ? (
            <Tooltip title={description}>
              <Typography sx={{ fontStyle: fileIcon === 'deletedFile' || !description ? 'italic' : '' }} noWrap>
                {description ?? t('log.unknown_filename')}
              </Typography>
            </Tooltip>
          ) : (
            <Typography>{description}</Typography>
          )}
          {fileIcon === 'deletedFile' && <Typography fontSize="x-small">{t('log.deleted_afterwards')}</Typography>}
        </Box>
      </Box>
      {date && (
        <Tooltip title={new Date(date).toLocaleTimeString()}>
          <Typography>{toDateString(new Date(date))}</Typography>
        </Tooltip>
      )}
    </>
  );
};

const LogActionItemIcon = ({ fileIcon }: Pick<LogActionItemType, 'fileIcon'>) => {
  const iconProps: SvgIconProps = { color: 'primary', sx: { height: '1rem', width: '1rem' } };
  switch (fileIcon) {
    case 'file':
      return <InsertDriveFileOutlinedIcon {...iconProps} />;
    case 'archivedFile':
      return <InsertPageBreakOutlinedIcon {...iconProps} />;
    case 'deletedFile':
      return <CloseOutlinedIcon {...iconProps} />;
    case 'rejectedFile':
      return <DoNotDisturbOutlinedIcon {...iconProps} />;
    default:
      return;
  }
};
