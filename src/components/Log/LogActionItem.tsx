import {
  CloseOutlined,
  DoNotDisturbOutlined,
  InsertDriveFileOutlined,
  InsertPageBreakOutlined,
} from '@mui/icons-material';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LogActionItem as LogActionItemType } from '../../types/log.types';
import { toDateString } from '../../utils/date-helpers';

export const LogActionItem = ({ description, date, icon }: LogActionItemType) => {
  const { t } = useTranslation();
  const itemIsFile = !!icon;
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '0.5rem', alignItems: 'center' }}>
        {icon && <LogActionItemIcon icon={icon} />}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          {itemIsFile ? (
            <Tooltip title={description}>
              <Typography noWrap overflow="hidden">
                {description}
              </Typography>
            </Tooltip>
          ) : (
            <Typography>{description}</Typography>
          )}
          {icon === 'deletedFile' && <Typography fontSize="x-small">{t('log.deleted_afterwards')}</Typography>}
          {icon === 'archivedFile' && <Typography fontSize="x-small">{t('log.archived_afterwards')}</Typography>}
        </Box>
      </Box>
      <div>
        {date && (
          <Tooltip title={new Date(date).toLocaleTimeString()}>
            <Typography>{toDateString(new Date(date))}</Typography>
          </Tooltip>
        )}
      </div>
    </>
  );
};

const LogActionItemIcon = ({ icon }: Pick<LogActionItemType, 'icon'>) => {
  switch (icon) {
    case 'file':
      return <InsertDriveFileOutlined color="primary" />;
    case 'archivedFile':
      return <InsertPageBreakOutlined color="primary" />;
    case 'deletedFile':
      return <CloseOutlined color="primary" />;
    case 'rejectedFile':
      return <DoNotDisturbOutlined color="primary" />;
    default:
      return;
  }
};
