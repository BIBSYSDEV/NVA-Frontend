import { Link, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { PreviousPathLocationState } from '../../types/locationState.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const identifier = getIdentifierFromId(id);
  const containerQuery = useFetchRegistration(identifier);

  const container = containerQuery.data;

  return containerQuery.isPending ? (
    <Skeleton width={400} />
  ) : container ? (
    <Link
      component={RouterLink}
      state={{ previousPath: `${location.pathname}${location.search}` } satisfies PreviousPathLocationState}
      to={getRegistrationLandingPagePath(identifier)}>
      {getTitleString(container.entityDescription?.mainTitle)}
    </Link>
  ) : null;
};
