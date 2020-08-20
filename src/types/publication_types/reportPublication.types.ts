import { BackendType, PublicationDate, PagesMonograph } from '../publication.types';
import { PublicationType, ReportType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { Contributor } from '../contributor.types';

interface ReportPublicationInstance {
  type: ReportType | '';
  pages: PagesMonograph | null;
  peerReviewed: boolean;
}

interface ReportPublicationContext {
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
  contributors: Contributor[];
  date: PublicationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  reference: ReportReference;
  tags: string[];
}
