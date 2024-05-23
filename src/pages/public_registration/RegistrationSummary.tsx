import { Link, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { fetchRegistration } from '../../api/registrationApi';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const { t } = useTranslation();

  const identifier = getIdentifierFromId(id);

  const containerQuery = useQuery({
    queryKey: ['registration', identifier],
    queryFn: () => fetchRegistration(identifier),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const container = containerQuery.data;

  return containerQuery.isPending ? (
    <Skeleton width={400} />
  ) : container ? (
    <Link component={RouterLink} to={getRegistrationLandingPagePath(identifier)}>
      {getTitleString(container.entityDescription?.mainTitle)}
    </Link>
  ) : null;
};
