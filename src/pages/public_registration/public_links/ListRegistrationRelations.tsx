import { List, ListItem, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Registration } from '../../../types/registration.types';
import { getTitleString } from '../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';

interface ListRegistrationRelationsProps {
  registrations: Registration[];
}

export const ListRegistrationRelations = ({ registrations }: ListRegistrationRelationsProps) => (
  <List>
    {registrations.map((registration) => (
      <ListItem key={registration.identifier}>
        <Link component={RouterLink} to={getRegistrationLandingPagePath(registration.identifier)}>
          {getTitleString(registration.entityDescription?.mainTitle)}
        </Link>
      </ListItem>
    ))}
  </List>
);
