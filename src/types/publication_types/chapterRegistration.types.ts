import { Contributor } from '../contributor.types';
import { LanguageValues } from '../language.types';
import { ChapterType, PublicationType } from '../publicationFieldNames';
import { BackendType, RegistrationDate } from '../registration.types';
import { PagesRange, emptyPagesRange } from './pages.types';

export interface ChapterPublicationInstance {
  type: ChapterType | '';
  pages: PagesRange;
  peerReviewed?: boolean;
}

export interface ChapterPublicationContext {
  type: PublicationType.CHAPTER;
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
  peerReviewed: false,
};

interface ChapterReference extends BackendType {
  doi: string;
  publicationContext: ChapterPublicationContext;
  publicationInstance: ChapterPublicationInstance;
}

export interface ChapterEntityDescription extends BackendType {
  abstract: string;
  contributors: Contributor[];
  date: RegistrationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: ChapterReference;
  tags: string[];
}
