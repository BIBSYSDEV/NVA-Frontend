import { useEffect } from 'react';
import { useFetchBookRegistration } from '../../../../../../api/hooks/useFetchBookRegistration';
import { useFetchPublisherFromId } from '../../../../../../api/hooks/useFetchPublisherFromId';
import { ChapterPublicationContext } from '../../../../../../types/publication_types/chapterRegistration.types';
import { Registration } from '../../../../../../types/registration.types';
import { useJournalSeoData } from '../../../../../../utils/hooks/useJournalSeoData';
import { stringIncludesMathJax, typesetMathJax } from '../../../../../../utils/mathJaxHelpers';
import { isChapter } from '../../../../../../utils/registration-helpers';
import { formatAuthorList, getEditors, getPublisherId } from '../_utils/citation-helpers';
import { formatAPA } from '../_utils/format-apa';

/**
 * Builds the plain-text (APA) citation string for a registration, resolving the parent book and
 * publisher data that chapters need and triggering MathJax typesetting when a title contains math.
 */
export const useApaCitation = (registration: Registration): string => {
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

  useEffect(() => {
    if (stringIncludesMathJax(mainTitle) || stringIncludesMathJax(bookTitle)) {
      typesetMathJax();
    }
  }, [mainTitle, bookTitle]);

  return formatAPA(registration, { journalName, publisherName, bookTitle, editors });
};
