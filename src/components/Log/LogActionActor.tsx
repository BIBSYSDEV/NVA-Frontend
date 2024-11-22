import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchUserQuery } from '../../api/hooks/useFetchUserQuery';
import { LogAction as LogActionType } from '../../types/log.types';
import { getFullName } from '../../utils/user-helpers';
import { Avatar } from '../Avatar';
import { OrganizationNameAndIcon } from '../OrganizationNameAndIcon';

export const LogActionActor = ({ actor = '', organization }: Pick<LogActionType, 'actor' | 'organization'>) => {
  const { t } = useTranslation();
  const userQuery = useFetchUserQuery(actor, { retry: 0, staleTime: Infinity, gcTime: 1_800_000 });
  const fullName = getFullName(userQuery.data?.givenName, userQuery.data?.familyName);

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '0.3rem', alignItems: 'center' }}>
        {<Avatar username={actor} sx={{ height: '1.5rem', width: '1.5rem' }} />}
        {userQuery.isLoading ? (
          <Skeleton sx={{ width: '6rem' }} />
        ) : (
          <Tooltip title={fullName}>
            <Typography noWrap overflow="hidden">
              {fullName ? fullName : <i>{t('common.unknown')}</i>}
            </Typography>
          </Tooltip>
        )}
      </Box>
      <OrganizationNameAndIcon id={organization ?? userQuery.data?.institutionCristinId ?? ''} />
    </Box>
  );
};
