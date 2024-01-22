import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { fetchResults } from '../../api/searchApi';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { PublicPublisher } from './PublicPublicationContext';

interface ChapterPublisherInfoProps {
  publicationContext: ChapterPublicationContext;
}

export const ChapterPublisherInfo = ({ publicationContext }: ChapterPublisherInfoProps) => {
  const publisherIdentifier = publicationContext.id && getIdentifierFromId(publicationContext.id);

  const publisherQuery = useQuery({
    enabled: !!publisherIdentifier,
    queryKey: ['publisher', publisherIdentifier],
    queryFn: () => fetchResults({ id: publisherIdentifier, results: 1 }),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const publisherQueryResult = publisherQuery.data?.hits[0];

  const publisher =
    publisherQueryResult &&
    (publisherQueryResult?.entityDescription?.reference?.publicationContext as BookPublicationContext).publisher;

  const publisherIsbn =
    publisherQueryResult &&
    (publisherQueryResult?.entityDescription?.reference?.publicationContext as BookPublicationContext).isbnList[0];

  return (
    <>
      {publisherIsbn && (
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: '0.5rem', mt: '0.5rem' }}>
          <Typography fontWeight="bold">{t('registration.resource_type.isbn')}</Typography>
          <Typography>{publisherIsbn}</Typography>
        </Box>
      )}
      <PublicPublisher publisher={publisher} />
    </>
  );
};
