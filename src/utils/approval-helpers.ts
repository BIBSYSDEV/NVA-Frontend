import { Approval, ApprovalIdentifier, ApprovalIdentifierName } from '../types/approval.types';
import { NewProjectApproval, ProjectApplicationCode, ProjectApprovalAuthority } from '../types/project.types';

interface ProjectApprovalSource {
  authority: ProjectApprovalAuthority;
  applicationCode: ProjectApplicationCode;
}

/**
 * How Cristin registers the approvals from each supported source.
 * NOTE: REK (Regionale komiteer for medisinsk og helsefaglig forskningsetikk) gives ethical approvals.
 * DMP (Direktoratet for medisinske produkter, formerly Statens legemiddelverk) approves clinical drug trials.
 */
const projectApprovalSourceByIdentifierName: Record<ApprovalIdentifierName, ProjectApprovalSource> = {
  [ApprovalIdentifierName.Rek]: { authority: 'RegionalEthicalCommittees', applicationCode: 'EthicalApproval' },
  [ApprovalIdentifierName.Dmp]: { authority: 'NorwegianMedicinesAgency', applicationCode: 'DrugTrial' },
};

const supportedIdentifierNames = Object.values(ApprovalIdentifierName);

const isSupportedIdentifierName = (identifierName: string): identifierName is ApprovalIdentifierName =>
  supportedIdentifierNames.some((supportedIdentifierName) => supportedIdentifierName === identifierName);

interface SupportedApprovalIdentifier {
  name: ApprovalIdentifierName;
  value: string;
}

const findSupportedIdentifier = (approval: Approval): SupportedApprovalIdentifier | null => {
  const supportedIdentifier = approval.identifiers.find((identifier) => isSupportedIdentifierName(identifier.name));
  return supportedIdentifier && isSupportedIdentifierName(supportedIdentifier.name)
    ? { name: supportedIdentifier.name, value: supportedIdentifier.value }
    : null;
};

/** Returns true when the approval has an identifier from a source that can be connected to a project */
export const isSupportedApproval = (approval: Approval) => !!findSupportedIdentifier(approval);

/**
 * Creates the project approval for an approval from the approval API, based on its first supported identifier.
 * Returns null when the approval has no supported identifier.
 */
export const toNewProjectApproval = (approval: Approval, today = new Date()): NewProjectApproval | null => {
  const supportedIdentifier = findSupportedIdentifier(approval);
  if (!supportedIdentifier) {
    return null;
  }

  return {
    type: 'Approval',
    // TODO: Use the date of the approval when the approval API provides it
    date: today.toISOString(),
    ...projectApprovalSourceByIdentifierName[supportedIdentifier.name],
    status: 'Approved',
    identifier: supportedIdentifier.value,
  };
};

/**
 * Returns the identifier the project approval can be found with in the approval API,
 * or null when the authority of the project approval is not a supported source.
 */
export const getApprovalIdentifier = (
  projectApproval: Pick<NewProjectApproval, 'authority' | 'identifier'>
): Pick<ApprovalIdentifier, 'name' | 'value'> | null => {
  const identifierName = supportedIdentifierNames.find(
    (supportedIdentifierName) =>
      projectApprovalSourceByIdentifierName[supportedIdentifierName].authority === projectApproval.authority
  );

  return identifierName && projectApproval.identifier
    ? { name: identifierName, value: projectApproval.identifier }
    : null;
};

/** Returns the project approvals with status Approved, leaving out rejected ones */
export const getApprovedApprovals = <ApprovalType extends Pick<NewProjectApproval, 'status'>>(
  projectApprovals: ApprovalType[] = []
) => projectApprovals.filter((projectApproval) => projectApproval.status === 'Approved');

/** Returns the approval with an identifier matching both name and value, or null when none match */
export const findApprovalWithIdentifier = (
  approvals: Approval[],
  approvalIdentifier: Pick<ApprovalIdentifier, 'name' | 'value'>
) =>
  approvals.find((approval) =>
    approval.identifiers.some(
      (identifier) => identifier.name === approvalIdentifier.name && identifier.value === approvalIdentifier.value
    )
  ) ?? null;
