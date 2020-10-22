import { levelMap, Publisher } from '../../../types/registration.types';
import { JournalPublicationContext } from '../../../types/publication_types/journalRegistration.types';
import { PublicationType } from '../../../types/publicationFieldNames';

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

export const formatPublicationContextWithPublisher = (publisher: Publisher, type: string) => {
  const { title, ...rest } = publisher;

  const formatted = publisher
    ? {
        ...rest,
        publihser: title,
        level: mapLevel(publisher.level),
        type,
      }
    : {
        type,
      };
  return formatted;
};

const mapLevel = (level: any) => Object.keys(levelMap).find((key) => levelMap[key] === level);
