import { Approval } from '../types/approval.types';
import { NewProjectApproval } from '../types/project.types';

const dmpIdentifierName = 'DMP';

/** Returns the approval with an identifier matching the given value, or null when none match */
export const findApprovalWithIdentifier = (approvals: Approval[], identifierValue: string) =>
  approvals.find((approval) => approval.identifiers.some((identifier) => identifier.value === identifierValue)) ?? null;

/**
 * Creates the project approval for an approval from the approval API.
 * The DMP number is stored as identifier, since the approval can be found again by searching for it.
 * NOTE: DMP (Direktoratet for medisinske produkter, formerly Statens legemiddelverk) approves clinical drug trials,
 * which Cristin registers as authority NorwegianMedicinesAgency with application code DrugTrial.
 */
export const toNewProjectApproval = (approval: Approval, today = new Date()): NewProjectApproval | null => {
  const dmpIdentifier = approval.identifiers.find((identifier) => identifier.name === dmpIdentifierName);
  if (!dmpIdentifier) {
    return null;
  }

  return {
    type: 'Approval',
    // TODO: Use the date of the approval when the approval API provides it
    date: today.toISOString(),
    authority: 'NorwegianMedicinesAgency',
    applicationCode: 'DrugTrial',
    status: 'Approved',
    identifier: dmpIdentifier.value,
  };
};
