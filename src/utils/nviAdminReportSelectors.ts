import { TFunction } from 'i18next';
import i18n from '../translations/i18n';
import { InstitutionReport } from '../types/nvi.types';
import { NviAdminOrderBy } from '../types/nviAdminSort';
import { getLanguageString } from './translation-helpers';

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
  }
};
