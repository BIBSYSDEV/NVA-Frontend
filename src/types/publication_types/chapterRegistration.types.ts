import { ChapterType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription, BaseReference, BaseRegistration, NviApplicableBase } from '../registration.types';
import { ChapterContentType } from './content.types';
import { PagesRange, emptyPagesRange } from './pages.types';

export interface ChapterRegistration extends BaseRegistration {
  entityDescription: ChapterEntityDescription;
}

export interface ChapterPublicationInstance extends NviApplicableBase<ChapterContentType> {
  type: ChapterType | '';
  pages: PagesRange;
}

export interface ChapterPublicationContext {
  type: PublicationType.Chapter;
  level: string | null;
  onlineIssn: string;
  openAccess: boolean;
  peerReviewed: boolean;
  printIssn: string;
  publisher: string;
  url: string;
  linkedContext: string;
}

export const emptyChapterPublicationInstance: ChapterPublicationInstance = {
  type: '',
  pages: emptyPagesRange,
  contentType: null,
  peerReviewed: null,
};

interface ChapterReference extends BaseReference {
  publicationContext: ChapterPublicationContext;
  publicationInstance: ChapterPublicationInstance;
}

export interface ChapterEntityDescription extends BaseEntityDescription {
  reference: ChapterReference;
}
