import { Link, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { fetchResults2 } from '../../api/searchApi';
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
    queryKey: ['container', identifier],
    queryFn: () => fetchResults2(1, 0, { identifier }),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const container = containerQuery && containerQuery.data?.hits.length === 1 ? containerQuery.data.hits[0] : null;

  return containerQuery.isLoading ? (
    <Skeleton width={400} />
  ) : (
    container && (
      <Link component={RouterLink} to={getRegistrationLandingPagePath(identifier)}>
        {getTitleString(container.entityDescription?.mainTitle)}
      </Link>
    )
  );
};
