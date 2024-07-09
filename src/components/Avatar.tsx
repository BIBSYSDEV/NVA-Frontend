import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Tooltip } from '@mui/material';
import { useFetchUserQuery } from '../api/hooks/useFetchUserQuery';
import { getInitials } from '../utils/general-helpers';
import { getFullName } from '../utils/user-helpers';

interface AvatarProps extends Pick<MuiAvatarProps, 'sx'> {
  username: string;
}

export const Avatar = ({ username, sx }: AvatarProps) => {
  const userQuery = useFetchUserQuery(username, { retry: 0, staleTime: Infinity, gcTime: 1_800_000 });
  const fullName = getFullName(userQuery.data?.givenName, userQuery.data?.familyName);
  const initials = getInitials(fullName);

  return (
    <Tooltip title={fullName}>
      <MuiAvatar
        sx={{
          height: '1.3rem',
          width: '1.3rem',
          fontSize: '0.7rem',
          bgcolor: 'primary.main',
          ...sx,
        }}>
        {initials}
      </MuiAvatar>
    </Tooltip>
  );
};
