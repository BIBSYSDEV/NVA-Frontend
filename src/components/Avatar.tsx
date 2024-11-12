import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, Tooltip } from '@mui/material';
import { getInitials } from '../utils/general-helpers';
import { useFetchUserQuery } from '../utils/hooks/useFetchUserQuery';
import { getFullName } from '../utils/user-helpers';

interface AvatarProps extends Pick<MuiAvatarProps, 'sx'> {
  username: string;
}

export const Avatar = ({ username, sx }: AvatarProps) => {
  const user = useFetchUserQuery(username).data;
  const fullName = getFullName(user?.givenName, user?.familyName);
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
