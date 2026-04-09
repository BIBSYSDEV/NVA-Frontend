import { TFunction } from 'i18next';
import i18n from '../../../../translations/i18n';
import { InstitutionReport } from '../../../../types/nvi.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const getNviInstitutionName = (report: InstitutionReport) => getLanguageString(report.institution.labels).trim();

export const getNviSectorLabel = (report: InstitutionReport, t: TFunction) => {
  const sectorKey = `basic_data.institutions.sector_values.${report.sector}`;
  return i18n.exists(sectorKey) ? t(sectorKey as any) : report.sector;
};

export const getNviValidPoints = (report: InstitutionReport) => report.institutionSummary.totals.validPoints;

export const getNviCountOthersMustApprove = (report: InstitutionReport) =>
  report.institutionSummary.totals.undisputedProcessedCount -
  (report.institutionSummary.byLocalApprovalStatus.approved + report.institutionSummary.byLocalApprovalStatus.rejected);

export const getNviApprovedByEverybody = (report: InstitutionReport) =>
  report.institutionSummary.totals.globalApprovedCount;

export const getNviCandidatesCount = (report: InstitutionReport) => report.institutionSummary.byLocalApprovalStatus.new;

export const getNviApprovedCount = (report: InstitutionReport) =>
  report.institutionSummary.byLocalApprovalStatus.approved;

export const getNviRejectedCount = (report: InstitutionReport) =>
  report.institutionSummary.byLocalApprovalStatus.rejected;

export const getNviTotalCount = (report: InstitutionReport) => report.institutionSummary.totals.undisputedTotalCount;

export const getPercentageControlled = (report: InstitutionReport) => {
  const undisputedTotals = report.institutionSummary.totals.undisputedTotalCount;
  const { approved, rejected } = report.institutionSummary.byLocalApprovalStatus;
  return undisputedTotals > 0 ? (approved + rejected) / undisputedTotals : 0;
};
