import {
  CloseOutlined,
  DoNotDisturbOutlined,
  InsertDriveFileOutlined,
  InsertPageBreakOutlined,
} from '@mui/icons-material';
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
              <Typography sx={{ fontStyle: fileIcon === 'deletedFile' ? 'italic' : '' }} noWrap overflow="hidden">
                {description}
              </Typography>
            </Tooltip>
          ) : (
            <Typography>{description}</Typography>
          )}
          {fileIcon === 'deletedFile' && <Typography fontSize="x-small">{t('log.deleted_afterwards')}</Typography>}
          {fileIcon === 'archivedFile' && <Typography fontSize="x-small">{t('log.archived_afterwards')}</Typography>}
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
      return <InsertDriveFileOutlined {...iconProps} />;
    case 'archivedFile':
      return <InsertPageBreakOutlined {...iconProps} />;
    case 'deletedFile':
      return <CloseOutlined {...iconProps} />;
    case 'rejectedFile':
      return <DoNotDisturbOutlined {...iconProps} />;
    default:
      return;
  }
};
