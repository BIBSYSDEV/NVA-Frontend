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
