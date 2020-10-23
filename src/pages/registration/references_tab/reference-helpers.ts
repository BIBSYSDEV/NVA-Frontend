import { levelMap, Publisher } from '../../../types/registration.types';
import { JournalPublicationContext } from '../../../types/publication_types/journalRegistration.types';
import { PublicationType } from '../../../types/publicationFieldNames';
import { BookPublicationContext } from '../../../types/publication_types/bookRegistration.types';

export const formatPublicationContextWithTitle = (
  type: '' | PublicationType,
  publisher?: Publisher
): Partial<JournalPublicationContext> => {
  const formatted = publisher
    ? {
        ...publisher,
        level: mapLevel(publisher.level),
        type,
      }
    : {
        type,
      };
  return formatted;
};

export const formatPublicationContextWithPublisher = (
  type: '' | PublicationType,
  publisher?: Publisher
): Partial<BookPublicationContext> => {
  const formatted = publisher
    ? {
        ...publisher,
        publisher: publisher.title,
        level: mapLevel(publisher.level),
        type,
      }
    : {
        type,
      };
  return formatted;
};

export const publicationContextToPublisher = (context: any) => {
  const publisher: Publisher = {
    type: '',
    title: context.title || context.publisher,
    onlineIssn: context.onlineIssn,
    printIssn: context.printIssn,
    level: context.level,
    openAccess: context.openAccess,
    peerReviewed: context.peerReviewed,
    url: context.url,
  };
  return publisher;
};

const mapLevel = (level: string | number | null) => Object.keys(levelMap).find((key) => levelMap[key] === level);
