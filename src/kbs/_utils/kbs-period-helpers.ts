import { KbsReport, KbsStatus } from '../kbs-action-panel/kbs.types';

export const canCloseKbsPeriod = (status: KbsStatus) =>
  status === KbsStatus.Candidate || status === KbsStatus.Delivered;

/** Active projects become candidates for the next year with no patient counts. Ended projects become reported */
export const getKbsReportAfterPeriodClose = (kbsReport: KbsReport): KbsReport =>
  kbsReport.isProjectActive
    ? { ...kbsReport, status: KbsStatus.Candidate, year: kbsReport.year + 1, patientCounts: {} }
    : { ...kbsReport, status: KbsStatus.Reported };
