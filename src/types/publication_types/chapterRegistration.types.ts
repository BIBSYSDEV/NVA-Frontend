import { ChapterType, PublicationType } from '../publicationFieldNames';
import { BaseEntityDescription } from '../registration.types';
import { NviApplicableBase } from './commonRegistration.types';
import { ChapterContentType } from './content.types';
import { PagesRange, emptyPagesRange } from './pages.types';

export interface ChapterPublicationInstance extends NviApplicableBase<ChapterContentType> {
  type: ChapterType | '';
  pages: PagesRange;
}

export interface ChapterPublicationContext {
  type: PublicationType.Chapter;
  level: string | number | null;
  onlineIssn: string;
  openAccess: boolean;
  peerReviewed: boolean;
  printIssn: string;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
  linkedContext: string;
}

export const emptyChapterPublicationInstance: ChapterPublicationInstance = {
  type: '',
  pages: emptyPagesRange,
  contentType: null,
  peerReviewed: null,
  originalResearch: null,
};

interface ChapterReference {
  type: 'Reference';
  doi: string;
  publicationContext: ChapterPublicationContext;
  publicationInstance: ChapterPublicationInstance;
}

export interface ChapterEntityDescription extends BaseEntityDescription {
  reference: ChapterReference;
}
