import { KbsReport, KbsStatus } from '../kbs-action-panel/kbs.types';

const kbsReportsStorageKey = 'kbs-preview-reports';

type KbsReportsByProjectId = Record<string, KbsReport>;

export const createDefaultKbsReport = (): KbsReport => ({
  status: KbsStatus.NotAssessed,
  year: new Date().getFullYear(),
  patientCounts: {},
  isProjectActive: true,
});

const readAllKbsReports = (): KbsReportsByProjectId => {
  try {
    return JSON.parse(localStorage.getItem(kbsReportsStorageKey) ?? '{}');
  } catch {
    return {};
  }
};

/** Mock replacement for fetching the KBS report for a project. Projects without saved data start as not assessed */
export const readKbsReport = (projectId: string): KbsReport => ({
  ...createDefaultKbsReport(),
  ...readAllKbsReports()[projectId],
});

/** Mock replacement for saving the KBS report for a project */
export const writeKbsReport = (projectId: string, kbsReport: KbsReport) => {
  const allKbsReports = readAllKbsReports();
  localStorage.setItem(kbsReportsStorageKey, JSON.stringify({ ...allKbsReports, [projectId]: kbsReport }));
};
