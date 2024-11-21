import { Box, Divider } from '@mui/material';
import { LogAction as LogActionType } from '../../types/log.types';
import { LogActionActor } from './LogActionActor';
import { LogActionItem } from './LogActionItem';

export const LogAction = ({ actor, organization, items }: LogActionType) => {
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'start', mt: '0.5rem' }}>
        {(!!actor || !!organization) && <LogActionActor actor={actor} organization={organization} />}
        {items.length > 0 && (
          <>
            <Divider sx={{ mt: '0.25rem' }} />
            {items.map((item, index) => (
              <LogActionItem {...item} key={index} />
            ))}
          </>
        )}
      </Box>
    </>
  );
};
