import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchBibtexCitation } from '../../../../../api/hooks/useFetchBibtexCitation';
import { useFetchBookRegistration } from '../../../../../api/hooks/useFetchBookRegistration';
import { useFetchPublisherFromId } from '../../../../../api/hooks/useFetchPublisherFromId';
import { ChapterPublicationContext } from '../../../../../types/publication_types/chapterRegistration.types';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useJournalSeoData } from '../../../../../utils/hooks/useJournalSeoData';
import { stringIncludesMathJax, typesetMathJax } from '../../../../../utils/mathJaxHelpers';
import { isChapter } from '../../../../../utils/registration-helpers';
import { CopyCitationButton } from './_components/CopyCitationButton';
import { ReferenceContent } from './_components/ReferenceContent';
import {
  getReferenceFormatTabId,
  ReferenceFormat,
  referenceFormatPanelId,
  ReferenceFormatToggle,
} from './_components/ReferenceFormatToggle';
import { formatAuthorList, getEditors, getPublisherId } from './_utils/citation-helpers';
import { formatAPA } from './_utils/format-apa';
import { getReferenceDisplayState } from './_utils/reference-display';

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

  const isChapterRegistration = isChapter(reference?.publicationInstance?.type);
  const parentBookId = isChapterRegistration
    ? ((publicationContext as ChapterPublicationContext | undefined)?.id ?? '')
    : '';
  const parentBook = useFetchBookRegistration(parentBookId).data;
  const bookTitle = parentBook?.entityDescription?.mainTitle ?? '';
  const editors = parentBook ? formatAuthorList(getEditors(parentBook), { role: 'editor' }) : '';

  // For chapters the publisher lives on the parent book's context, not the chapter's own context.
  const publisherId = isChapterRegistration
    ? getPublisherId(parentBook?.entityDescription?.reference?.publicationContext)
    : getPublisherId(publicationContext);

  const publisherName = useFetchPublisherFromId(publisherId).data?.name ?? '';

  const citation = formatAPA(registration, { journalName, publisherName, bookTitle, editors });

  const [format, setFormat] = useState<ReferenceFormat>('plain');
  const isBibtex = format === 'bibtex';

  const bibtexQuery = useFetchBibtexCitation(registration.identifier, isBibtex);

  const {
    citation: activeCitation,
    isLoading,
    isError,
    isCopyDisabled,
  } = getReferenceDisplayState(format, citation, bibtexQuery);

  useEffect(() => {
    if (!isBibtex && (stringIncludesMathJax(mainTitle) || stringIncludesMathJax(bookTitle))) {
      typesetMathJax();
    }
  }, [mainTitle, bookTitle, isBibtex]);

  if (!citation) {
    return null;
  }

  return (
    <Box component="section" display="flex" flexDirection="column">
      <Typography id={citationHeadingId} variant="h3" gutterBottom>
        {t('reference')}
      </Typography>
      <ReferenceFormatToggle value={format} onChange={setFormat} />
      <Paper
        data-testid={dataTestId.registrationLandingPage.detailsTab.referenceTextBox}
        variant="outlined"
        role="tabpanel"
        id={referenceFormatPanelId}
        tabIndex={0}
        aria-labelledby={getReferenceFormatTabId(format)}
        aria-busy={isLoading}
        sx={{ p: '1rem', maxHeight: '12rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
        <ReferenceContent citation={activeCitation} isLoading={isLoading} isError={isError} />
      </Paper>
      <CopyCitationButton citation={activeCitation} disabled={isCopyDisabled} />
    </Box>
  );
};
