import { BackendType, PublicationDate, PagesMonograph } from '../publication.types';
import { PublicationType, DegreeType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';
import { BackendTypeNames, emptyDate } from './common.publication.types';

interface ReportPublicationInstance {
  type: DegreeType | '';
  pages: PagesMonograph | null;
  peerReviewed: boolean;
}

export interface ReportPublicationContext {
  type: PublicationType | '';
  isbnList: string[];
  level: string | number | null;
  onlineIssn: string;
  openAccess: boolean;
  peerReviewed: boolean;
  printIssn: string;
  publisher: string;
  seriesNumber: string;
  seriesTitle: string;
  url: string;
}

interface ReportReference extends BackendType {
  doi: string;
  publicationContext: ReportPublicationContext;
  publicationInstance: ReportPublicationInstance;
}

export interface ReportEntityDescription extends BackendType {
  abstract: string;
  alternativeTitles?: string;
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  metadataSource?: string;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: ReportReference;
  tags: string[];
}

export const emptyPublicationInstance: ReportPublicationInstance = {
  type: '',
  pages: null,
  peerReviewed: false,
};

export const emptyPublicationContext: ReportPublicationContext = {
  type: '',
  isbnList: [],
  level: '',
  onlineIssn: '',
  openAccess: false,
  peerReviewed: false,
  printIssn: '',
  publisher: '',
  seriesNumber: '',
  seriesTitle: '',
  url: '',
};

export const emptyReference: ReportReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationContext: emptyPublicationContext,
  publicationInstance: emptyPublicationInstance,
};

export const emptyPublicationEntityDescription: ReportEntityDescription = {
  type: BackendTypeNames.ENTITY_DESCRIPTION,
  abstract: '',
  contributors: [],
  date: emptyDate,
  description: '',
  language: LanguageValues.NONE,
  mainTitle: '',
  npiSubjectHeading: '',
  reference: emptyReference,
  tags: [],
};
