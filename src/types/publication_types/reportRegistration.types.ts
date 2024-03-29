import { PublicationType, ReportType } from '../publicationFieldNames';
import {
  BaseEntityDescription,
  BaseReference,
  BaseRegistration,
  ContextPublisher,
  ContextSeries,
} from '../registration.types';
import { PagesMonograph, emptyPagesMonograph } from './pages.types';

export interface ReportRegistration extends BaseRegistration {
  entityDescription: ReportEntityDescription;
}

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
  publisher: ContextPublisher;
  seriesNumber: string;
  series?: ContextSeries;
  onlineIssn: string;
  printIssn: string;
}

interface ReportReference extends BaseReference {
  publicationContext: ReportPublicationContext;
  publicationInstance: ReportPublicationInstance;
}

export interface ReportEntityDescription extends BaseEntityDescription {
  reference: ReportReference | null;
}
