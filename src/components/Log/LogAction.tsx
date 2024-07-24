import { Box, Divider } from '@mui/material';
import { LogActionActor } from './LogActionActor';
import { LogActionItem } from './LogActionItem';
import { LogAction as LogActionType } from '../../types/log.types';

export const LogAction = ({ actor, organization, items }: LogActionType) => {
  return (
    <>
      <Divider sx={{ bgcolor: 'primary.main' }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
        {(!!actor || !!organization) && <LogActionActor actor={actor} organization={organization} />}
        {items && items.map((item, index) => <LogActionItem {...item} key={index} />)}
      </Box>
    </>
  );
};
