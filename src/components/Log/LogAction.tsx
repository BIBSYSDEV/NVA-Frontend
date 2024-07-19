import { Box, Divider } from '@mui/material';
import { LogActionItem } from './LogActionItem';
import { LogAction as LogActionType } from '../../types/log.types';
import { LogActionActor } from './LogActionActor';

export const LogAction = ({ actor, organization, items }: LogActionType) => {
  return (
    <>
      <Divider sx={{ bgcolor: 'primary.main' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
        <LogActionActor actor={actor} organization={organization} />
        {items && items.map((item) => <LogActionItem {...item} />)}
      </Box>
    </>
  );
};
