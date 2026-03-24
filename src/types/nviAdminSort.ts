export enum NviAdminOrderBy {
  Institution = 'institution',
  Sector = 'sector',
  Points = 'points',
  CandidatesApprovedByInstitution = 'candidatesApprovedByInstitution',
  CandidatesApprovedByEverybody = 'candidatesApprovedByEverybody',
}

export const nviAdminOrderByValues = Object.values(NviAdminOrderBy);

export const isNviAdminOrderBy = (value: string | null): value is NviAdminOrderBy =>
  nviAdminOrderByValues.includes(value as NviAdminOrderBy);
