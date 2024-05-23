import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/roleApi';
import { getInitials } from '../utils/general-helpers';
import { getFullName } from '../utils/user-helpers';

interface AvatarProps extends Pick<MuiAvatarProps, 'sx'> {
  username: string;
}

const tooltipDelay = 400;

export const Avatar = ({ username, sx }: AvatarProps) => {
  const userQuery = useQuery({
    enabled: !!username,
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    retry: 0,
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
  const user = userQuery.data;
  const fullName = getFullName(user?.givenName, user?.familyName);
  const initials = getInitials(fullName);

  return (
    <Tooltip title={fullName} enterDelay={tooltipDelay}>
      <MuiAvatar
        sx={{
          height: '1.3rem',
          width: '1.3rem',
          ml: '0.5rem',
          fontSize: '0.7rem',
          bgcolor: 'primary.main',
          ...sx,
        }}>
        {initials}
      </MuiAvatar>
    </Tooltip>
  );
};
