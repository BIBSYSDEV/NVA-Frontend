import { Box, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchBookRegistration } from '../../../../../api/hooks/useFetchBookRegistration';
import { useFetchPublisherFromId } from '../../../../../api/hooks/useFetchPublisherFromId';
import { ChapterPublicationContext } from '../../../../../types/publication_types/chapterRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { useJournalSeoData } from '../../../../../utils/hooks/useJournalSeoData';
import { isChapter } from '../../../../../utils/registration-helpers';
import { formatAPA } from './_utils/format-apa';
import { CopyCitationButton } from './_atoms/CopyCitationButton';

const citationHeadingId = 'citation-box-heading';

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const { journalName } = useJournalSeoData(registration);

  const publicationContext = registration.entityDescription?.reference?.publicationContext;
  const publisherId =
    (publicationContext && 'publisher' in publicationContext && publicationContext.publisher?.id) || '';
  const publisherName = useFetchPublisherFromId(publisherId).data?.name ?? '';

  const isChapterRegistration = isChapter(registration.entityDescription?.reference?.publicationInstance?.type);
  const parentBookId = isChapterRegistration
    ? ((publicationContext as ChapterPublicationContext | undefined)?.id ?? '')
    : '';
  const bookTitle = useFetchBookRegistration(parentBookId).data?.entityDescription?.mainTitle ?? '';

  const citation = formatAPA(registration, { journalName, publisherName, bookTitle });

  if (!citation) {
    return null;
  }

  return (
    <Box component="section" display="flex" flexDirection="column">
      <Typography id={citationHeadingId} variant="h3" gutterBottom>
        {t('citation')}
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={citation}
        slotProps={{
          input: { readOnly: true },
          htmlInput: { 'aria-labelledby': citationHeadingId },
        }}
      />
      <CopyCitationButton citation={citation} />
    </Box>
  );
};
