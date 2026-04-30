import { Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router';
import { getResearchProfilePath } from '../../utils/urlPaths';

interface CuratorNameProps {
  name: string;
  cristinId?: string;
}

export const NameWithLinkToProfile = ({ name, cristinId }: CuratorNameProps) => {
  if (cristinId) {
    return (
      <MuiLink component={Link} to={getResearchProfilePath(cristinId)}>
        {name}
      </MuiLink>
    );
  }
  return <Typography>{name}</Typography>;
};
