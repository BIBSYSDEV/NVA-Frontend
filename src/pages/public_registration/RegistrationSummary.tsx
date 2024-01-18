import { Box, Link, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { fetchResults } from '../../api/searchApi';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getTitleString } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { PublicPublisher } from './PublicPublicationContext';

interface RegistrationSummaryProps {
  id: string;
}

export const RegistrationSummary = ({ id }: RegistrationSummaryProps) => {
  const { t } = useTranslation();

  const identifier = getIdentifierFromId(id);

  const containerQuery = useQuery({
    queryKey: ['container', identifier],
    queryFn: () => fetchResults({ id: identifier, results: 1 }),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const container = containerQuery && containerQuery.data?.hits.length === 1 ? containerQuery.data.hits[0] : null;

  const containerPublishingContext = container?.entityDescription?.reference
    ?.publicationContext as ChapterPublicationContext;

  return containerQuery.isLoading ? (
    <Skeleton width={400} />
  ) : (
    container && (
      <>
        <Box sx={{ mb: '1rem' }}>
          <Link component={RouterLink} to={getRegistrationLandingPagePath(identifier)}>
            {getTitleString(container.entityDescription?.mainTitle)}
          </Link>
        </Box>

        <PublicPublisher publisher={containerPublishingContext.publisher} />
      </>
    )
  );
};
