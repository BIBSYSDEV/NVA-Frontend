import { Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router';
import { getResearchProfilePath } from '../../../utils/urlPaths';

interface CuratorContactInformationProps {
  name: string;
  cristinId?: string;
}

export const CuratorName = ({ name, cristinId }: CuratorContactInformationProps) => {
  if (cristinId) {
    return (
      <MuiLink component={Link} to={getResearchProfilePath(cristinId)}>
        {name}
      </MuiLink>
    );
  }
  return <Typography>{name}</Typography>;
};
