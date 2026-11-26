import { ApprovalApiPath } from '../api/apiPaths';
import { Approval, ApprovalIdentifier } from '../types/approval.types';
import { NewProjectApproval } from '../types/project.types';
import { API_URL } from './constants';
import { getIdentifierFromId } from './general-helpers';

type ProjectApprovalSource = Pick<NewProjectApproval, 'authority' | 'applicationCode'>;

const projectApprovalSourceByIdentifierName = new Map<string, ProjectApprovalSource>([
  ['REK', { authority: 'RegionalEthicalCommittees', applicationCode: 'EthicalApproval' }],
  ['DMP', { authority: 'NorwegianMedicinesAgency', applicationCode: 'DrugTrial' }],
]);

/**
 * Creates the project approval for an approval from the approval API, based on its first REK or DMP identifier.
 * Returns null when the approval has neither.
 */
export const toNewProjectApproval = (approval: Approval, today = new Date()): NewProjectApproval | null => {
  for (const identifier of approval.identifiers) {
    const source = projectApprovalSourceByIdentifierName.get(identifier.name);
    if (source) {
      return {
        type: 'Approval',
        // TODO: Use the date of the approval when the approval API provides it
        date: today.toISOString(),
        ...source,
        status: 'Approved',
        identifier: identifier.value,
      };
    }
  }
  return null;
};

/**
 * Returns the identifier the project approval can be found with in the approval API,
 * or null when the authority of the project approval is not REK or DMP.
 */
export const getApprovalIdentifier = (
  projectApproval: Pick<NewProjectApproval, 'authority' | 'identifier'>
): Pick<ApprovalIdentifier, 'name' | 'value'> | null => {
  const sourceEntries = [...projectApprovalSourceByIdentifierName.entries()];
  const matchingEntry = sourceEntries.find(([, source]) => source.authority === projectApproval.authority);
  const identifierName = matchingEntry?.[0];

  return identifierName && projectApproval.identifier
    ? { name: identifierName, value: projectApproval.identifier }
    : null;
};

/** Returns the project approvals with status Approved, leaving out rejected ones */
export const getApprovedApprovals = <ApprovalType extends Pick<NewProjectApproval, 'status'>>(
  projectApprovals: ApprovalType[] = []
) => projectApprovals.filter((projectApproval) => projectApproval.status === 'Approved');

/** Returns the URL of the public view of an approval, which shows the data from the source of the approval */
export const getApprovalViewUrl = (approvalId: string, apiUrl = API_URL) =>
  new URL(`${ApprovalApiPath.Approval}/${getIdentifierFromId(approvalId)}/view`, apiUrl).toString();
