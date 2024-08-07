import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { Avatar } from '../Avatar';
import { OrganizationNameAndIcon } from '../OrganizationNameAndIcon';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { LogAction as LogActionType } from '../../types/log.types';
import { getFullName } from '../../utils/user-helpers';

export const LogActionActor = ({ actor, organization }: Pick<LogActionType, 'actor' | 'organization'>) => {
  const userQuery = useFetchUserQuery(actor ?? '', { retry: 0, staleTime: Infinity, gcTime: 1_800_000 });
  const fullName = getFullName(userQuery.data?.givenName, userQuery.data?.familyName);
  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '0.5rem', alignItems: 'center' }}>
        {!!actor && <Avatar key={actor} username={actor} sx={{ height: '1.5rem', width: '1.5rem' }} />}
        {userQuery.isLoading ? (
          <Skeleton sx={{ width: '6rem' }} />
        ) : (
          <Tooltip title={fullName}>
            <Typography noWrap overflow="hidden">
              {fullName}
            </Typography>
          </Tooltip>
        )}
      </Box>
      <OrganizationNameAndIcon
        id={organization ?? userQuery.data?.institutionCristinId ?? ''}
        acronym
        sx={{ justifyContent: 'flex-end' }}
      />
    </>
  );
};
