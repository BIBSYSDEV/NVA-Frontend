import { levelMap, Publisher } from '../../../types/registration.types';
import { PublicationType } from '../../../types/publicationFieldNames';

export const formatPublicationContextWithTitle = (type: '' | PublicationType, publisher?: Publisher) => {
  const formattedPublicationContext = publisher
    ? {
        ...publisher,
        level: mapLevel(publisher.level),
        type,
      }
    : {
        type,
      };
  return formattedPublicationContext;
};

export const formatPublicationContextWithPublisher = (type: '' | PublicationType, publisher?: Publisher) => {
  const { title, ...restPublisher } = publisher || {};
  const formattedPublicationContext = publisher
    ? {
        ...restPublisher,
        publisher: title,
        level: mapLevel(publisher.level),
        type,
      }
    : {
        type,
      };
  return formattedPublicationContext;
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
