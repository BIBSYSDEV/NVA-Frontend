import { BackendType, BaseEntityDescription } from '../registration.types';
import { PublicationType, ReportType } from '../publicationFieldNames';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface ReportPublicationInstance {
  type: ReportType | '';
  pages: PagesMonograph | null;
}

export const emptyReportPublicationInstance: ReportPublicationInstance = {
  type: '',
  pages: emptyPagesMonograph,
};

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

export interface ReportEntityDescription extends BaseEntityDescription {
  reference: ReportReference;
}
