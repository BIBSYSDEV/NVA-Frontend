import { Box, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchBookRegistration } from '../../../../../api/hooks/useFetchBookRegistration';
import { useFetchPublisherFromId } from '../../../../../api/hooks/useFetchPublisherFromId';
import { ChapterPublicationContext } from '../../../../../types/publication_types/chapterRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { useJournalSeoData } from '../../../../../utils/hooks/useJournalSeoData';
import { stringIncludesMathJax, typesetMathJax } from '../../../../../utils/mathJaxHelpers';
import { isChapter } from '../../../../../utils/registration-helpers';
import { formatAPA } from './_utils/format-apa';
import { formatAuthorList, getEditors } from './_utils/citation-helpers';
import { CopyCitationButton } from './_components/CopyCitationButton';

const citationHeadingId = 'citation-box-heading';

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const { journalName } = useJournalSeoData(registration);

  const entityDescription = registration.entityDescription;
  const reference = entityDescription?.reference;
  const publicationContext = reference?.publicationContext;
  const mainTitle = entityDescription?.mainTitle ?? '';

  const publisherId =
    (publicationContext && 'publisher' in publicationContext && publicationContext.publisher?.id) || '';
  const publisherName = useFetchPublisherFromId(publisherId).data?.name ?? '';

  const isChapterRegistration = isChapter(reference?.publicationInstance?.type);
  const parentBookId = isChapterRegistration
    ? ((publicationContext as ChapterPublicationContext | undefined)?.id ?? '')
    : '';
  const parentBook = useFetchBookRegistration(parentBookId).data;
  const bookTitle = parentBook?.entityDescription?.mainTitle ?? '';
  const editors = parentBook ? formatAuthorList(getEditors(parentBook), { role: 'editor' }) : '';

  const citation = formatAPA(registration, { journalName, publisherName, bookTitle, editors });

  useEffect(() => {
    if (stringIncludesMathJax(mainTitle) || stringIncludesMathJax(bookTitle)) {
      typesetMathJax();
    }
  }, [mainTitle, bookTitle]);

  if (!citation) {
    return null;
  }

  return (
    <Box component="section" display="flex" flexDirection="column">
      <Typography id={citationHeadingId} variant="h3" gutterBottom>
        {t('citation')}
      </Typography>
      <Paper
        variant="outlined"
        role="region"
        tabIndex={0}
        aria-labelledby={citationHeadingId}
        sx={{ p: '1rem', maxHeight: '12rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
        <Typography>{citation}</Typography>
      </Paper>
      <CopyCitationButton citation={citation} />
    </Box>
  );
};
