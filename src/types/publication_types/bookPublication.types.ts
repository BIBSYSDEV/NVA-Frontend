import { BackendType, PublicationDate, PagesMonograph, emptyPagesMonograph } from '../publication.types';
import { PublicationType, BookType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';

interface BookPublicationInstance {
  type: BookType | '';
  pages: PagesMonograph | null;
  peerReviewed: boolean;
  isTextbook?: boolean; // TODO: Align with future backend implementation
}

export const emptyBookPublicationInstance: BookPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
  peerReviewed: false,
  isTextbook: false,
};

interface BookPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  level: string | number | null;
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
}

interface BookReference extends BackendType {
  doi: string;
  publicationContext: BookPublicationContext;
  publicationInstance: BookPublicationInstance;
}

export interface BookEntityDescription extends BackendType {
  abstract: string;
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: BookReference;
  tags: string[];
}
