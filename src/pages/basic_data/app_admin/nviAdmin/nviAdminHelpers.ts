import { TFunction } from 'i18next';
import i18n from '../../../../translations/i18n';
import { InstitutionReport } from '../../../../types/nvi.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export enum NviAdminSortSelectorType {
  Points = 'points',
  Status = 'status',
}

export enum NviAdminOrderBy {
  Institution = 'institution',
  Sector = 'sector',
  Points = 'points',
  CandidatesApprovedByInstitution = 'candidatesApprovedByInstitution',
  CandidatesApprovedByEverybody = 'candidatesApprovedByEverybody',
  TotalNumber = 'totalNumber',
  NumberOfCandidates = 'numberOfCandidates',
  NumberOfApprovedCandidates = 'numberOfApprovedCandidates',
  NumberOfRejectedCandidates = 'numberOfRejectedCandidates',
}

export const nviAdminOrderByValues = Object.values(NviAdminOrderBy);

export const isNviAdminOrderBy = (value: string | null): value is NviAdminOrderBy =>
  nviAdminOrderByValues.includes(value as NviAdminOrderBy);

export const getNviInstitutionName = (report: InstitutionReport) => getLanguageString(report.institution.labels).trim();

export const getNviSectorLabel = (report: InstitutionReport, t: TFunction) => {
  const sectorKey = `basic_data.institutions.sector_values.${report.sector}`;
  return i18n.exists(sectorKey) ? t(sectorKey as any) : report.sector;
};

export const getNviValidPoints = (report: InstitutionReport) => report.institutionSummary.totals.validPoints;

export const getNviApprovedByInstitution = (report: InstitutionReport) =>
  report.institutionSummary.byLocalApprovalStatus.approved;

export const getNviApprovedByEverybody = (report: InstitutionReport) =>
  report.institutionSummary.totals.globalApprovedCount;

export const getNviCandidatesCount = (report: InstitutionReport) => report.institutionSummary.byLocalApprovalStatus.new;

export const getNviApprovedCount = (report: InstitutionReport) =>
  report.institutionSummary.byLocalApprovalStatus.approved;

export const getNviRejectedCount = (report: InstitutionReport) =>
  report.institutionSummary.byLocalApprovalStatus.rejected;

export const getNviTotalCount = (report: InstitutionReport) => report.institutionSummary.totals.undisputedTotalCount;

export const getNviAdminSortValue = (report: InstitutionReport, orderBy: NviAdminOrderBy, t: TFunction) => {
  switch (orderBy) {
    case NviAdminOrderBy.Institution:
      return getNviInstitutionName(report).toLowerCase();
    case NviAdminOrderBy.Sector:
      return getNviSectorLabel(report, t).toLowerCase();
    case NviAdminOrderBy.Points:
      return getNviValidPoints(report);
    case NviAdminOrderBy.CandidatesApprovedByInstitution:
      return getNviApprovedByInstitution(report);
    case NviAdminOrderBy.CandidatesApprovedByEverybody:
      return getNviApprovedByEverybody(report);
    case NviAdminOrderBy.TotalNumber:
      return getNviTotalCount(report);
    case NviAdminOrderBy.NumberOfCandidates:
      return getNviCandidatesCount(report);
    case NviAdminOrderBy.NumberOfApprovedCandidates:
      return getNviApprovedCount(report);
    case NviAdminOrderBy.NumberOfRejectedCandidates:
      return getNviRejectedCount(report);
  }
};
