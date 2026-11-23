import { SearchResponse2 } from './common.types';

/** Identifier names of the approvals that can be connected to a project */
export enum ApprovalIdentifierName {
  Rek = 'REK',
  Dmp = 'DMP',
}

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
