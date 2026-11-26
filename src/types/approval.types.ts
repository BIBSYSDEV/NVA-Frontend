import { SearchResponse2 } from './common.types';

export interface ApprovalIdentifier {
  type: 'Identifier';
  name: string;
  value: string;
}

export interface Approval {
  type: 'Approval';
  id: string;
  handle: string;
  title: string;
  identifiers: ApprovalIdentifier[];
}

export type ApprovalSearchResponse = SearchResponse2<Approval>;

/** An approval fetched by its identifier, which has no title. The title is found in the view of the approval */
export type ApprovalDetails = Omit<Approval, 'title'>;

export enum ApprovalRegion {
  Norway = 'norway',
  Eea = 'eea',
}

export enum ApprovalEventType {
  TrialStart = 'TrialStart',
  TrialEnd = 'TrialEnd',
  RecruitmentStart = 'RecruitmentStart',
  RecruitmentEnd = 'RecruitmentEnd',
}

export interface ApprovalStatus {
  type: 'Status';
  region?: string;
  status?: string;
}

export interface ApprovalEvent {
  type: string;
  region?: string;
  date?: string;
}

export interface ApprovalSponsor {
  type: 'Sponsor';
  name?: string;
}

export interface ApprovalInvestigator {
  type: 'Investigator';
  person?: { type: 'Person'; id?: string };
  title?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
}

export interface ApprovalTrialSite {
  type: 'TrialSite';
  organization?: { type: 'Organization'; id?: string };
  departmentName?: string;
  investigator?: ApprovalInvestigator;
}

/** The view of the source of an approval. Only clinical trials from CTIS have a view */
export interface ApprovalView {
  type: 'ClinicalTrialView';
  id: string;
  wasDerivedFrom: string;
  identifier?: string;
  title?: string;
  modified?: string;
  statuses?: ApprovalStatus[];
  events?: ApprovalEvent[];
  sponsors?: ApprovalSponsor[];
  trialSites?: ApprovalTrialSite[];
}
