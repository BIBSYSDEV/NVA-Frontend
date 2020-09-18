import { BackendType, PublicationDate, PagesMonograph, emptyPagesMonograph } from '../publication.types';
import { PublicationType, DegreeType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';

export interface DegreePublicationInstance {
  type: DegreeType | '';
  pages: PagesMonograph | null;
}

export const emptyDegreePublicationInstance: DegreePublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

export interface DegreePublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  openAccess: boolean;
  peerReviewed: boolean;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
}

interface DegreeReference extends BackendType {
  doi: string;
  publicationContext: DegreePublicationContext;
  publicationInstance: DegreePublicationInstance;
}

export interface DegreeEntityDescription extends BackendType {
  abstract: string;
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: DegreeReference;
  tags: string[];
}
