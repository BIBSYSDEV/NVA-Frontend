import {
  ApprovalEvent,
  ApprovalEventType,
  ApprovalInvestigator,
  ApprovalRegion,
  ApprovalStatus,
  ApprovalTrialSite,
} from '../../../types/approval.types';

interface ApprovalPeriod {
  start?: string;
  end?: string;
}

// NOTE: The region is lowercase in statuses ("norway") and capitalized in events ("Norway")
const isInRegion = (itemRegion: string | undefined, region: ApprovalRegion) => itemRegion?.toLowerCase() === region;

const getEventDate = (events: ApprovalEvent[], type: ApprovalEventType, region: ApprovalRegion) =>
  events.find((event) => event.type === type && isInRegion(event.region, region))?.date;

/** Returns the start and end dates of the period in the region, or null when the region has none of them */
export const getApprovalPeriod = (
  events: ApprovalEvent[] = [],
  startType: ApprovalEventType,
  endType: ApprovalEventType,
  region: ApprovalRegion
): ApprovalPeriod | null => {
  const start = getEventDate(events, startType, region);
  const end = getEventDate(events, endType, region);
  return start || end ? { start, end } : null;
};

export const getRegionStatus = (statuses: ApprovalStatus[] = [], region: ApprovalRegion) =>
  statuses.find((status) => isInRegion(status.region, region))?.status;

/** Returns the name of the investigator with the title first, such as "Prof. Kari Nordmann" */
export const getInvestigatorName = (investigator?: ApprovalInvestigator) =>
  [investigator?.title, investigator?.firstName, investigator?.lastName].filter(Boolean).join(' ');

/** Returns the organization and the department of the investigator at the trial site */
export const getTrialSiteAffiliation = (trialSite: ApprovalTrialSite) =>
  [trialSite.departmentName, trialSite.investigator?.department].filter(Boolean).join(', ');
