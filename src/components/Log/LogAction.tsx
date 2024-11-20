import { Box } from '@mui/material';
import { LogAction as LogActionType } from '../../types/log.types';
import { LogActionActor } from './LogActionActor';
import { LogActionItem } from './LogActionItem';

export const LogAction = ({ actor, organization, items }: LogActionType) => {
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '0.5rem', justifyContent: 'start' }}>
        {(!!actor || !!organization) && <LogActionActor actor={actor} organization={organization} />}
        {items && items.map((item, index) => <LogActionItem {...item} key={index} />)}
      </Box>
    </>
  );
};
