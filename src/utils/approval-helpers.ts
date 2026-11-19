import { Approval } from '../types/approval.types';

/** Returns the approval with an identifier matching the given value, or null when none match */
export const findApprovalWithIdentifier = (approvals: Approval[], identifierValue: string) =>
  approvals.find((approval) => approval.identifiers.some((identifier) => identifier.value === identifierValue)) ?? null;
