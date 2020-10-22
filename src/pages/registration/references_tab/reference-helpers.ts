import { levelMap } from '../../../types/registration.types';
import { JournalPublicationContext } from '../../../types/publication_types/journalRegistration.types';

export const formatPublicationContextWithTitle = (publisher: any, type: string): JournalPublicationContext => {
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

export const formatPublicationContextWithPublisher = (publisher: any, type: string) => {
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
