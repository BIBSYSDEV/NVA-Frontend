import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchRegistration } from '../../api/registrationApi';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { PublicPublisher } from './PublicPublicationContext';

interface ChapterPublisherInfoProps {
  publicationContext: ChapterPublicationContext;
}

export const ChapterPublisherInfo = ({ publicationContext }: ChapterPublisherInfoProps) => {
  const { t } = useTranslation();

  const identifier = publicationContext.id ? getIdentifierFromId(publicationContext.id) : '';

  const publisherQuery = useQuery({
    enabled: !!identifier,
    queryKey: ['publisher', identifier],
    queryFn: () => fetchRegistration(identifier),
    meta: { errorMessage: t('feedback.error.search') },
  });

  const publisher = publisherQuery.data;

  const publisherPublicationContext =
    publisher &&
    (publisher?.entityDescription?.reference?.publicationContext as BookPublicationContext | ReportPublicationContext);

  return publisherPublicationContext ? (
    <>
      {publisherPublicationContext.isbnList && publisherPublicationContext.isbnList.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: '0.5rem' }}>
          <Typography fontWeight="bold">{t('registration.resource_type.isbn')}</Typography>
          {publisherPublicationContext.isbnList.map((isbn) => (
            <Typography key={isbn}>{isbn}</Typography>
          ))}
        </Box>
      )}
      <PublicPublisher publisher={publisherPublicationContext.publisher} />
    </>
  ) : null;
};
