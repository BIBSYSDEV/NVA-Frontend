import { Approval } from '../../../../../types/approval.types';
import { NewProjectApproval } from '../../../../../types/project.types';
import { getApprovalIdentifier } from '../../../../../utils/approval-helpers';

/**
 * Creates an approval to show in the search field when the approval of the project cannot be found in the approval
 * API. The title is the stored identifier, such as "DMP: 2024-512733-32-00", so the user can still see and clear it.
 */
export const createFallbackApproval = (
  projectApproval: Pick<NewProjectApproval, 'authority' | 'identifier'>
): Approval => {
  const approvalIdentifier = getApprovalIdentifier(projectApproval);

  return {
    type: 'Approval',
    id: projectApproval.identifier,
    handle: '',
    title: approvalIdentifier ? `${approvalIdentifier.name}: ${approvalIdentifier.value}` : projectApproval.identifier,
    identifiers: approvalIdentifier ? [{ type: 'Identifier', ...approvalIdentifier }] : [],
  };
};
