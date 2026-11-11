interface ApprovalIdentifier {
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

export interface ApprovalSearchResponse {
  totalHits: number;
  hits: Approval[];
}
