import { Link as MuiLink, Typography } from '@mui/material';
import { Link } from 'react-router';
import { dataTestId } from '../../utils/dataTestIds';
import { getResearchProfilePath } from '../../utils/urlPaths';

interface CuratorNameProps {
  name: string;
  cristinId?: string;
}

export const NameWithLinkToProfile = ({ name, cristinId }: CuratorNameProps) => {
  if (cristinId) {
    return (
      <MuiLink
        data-testid={dataTestId.researchProfileLink(cristinId)}
        component={Link}
        to={getResearchProfilePath(cristinId)}>
        {name}
      </MuiLink>
    );
  }
  return <Typography>{name}</Typography>;
};
