import { Approval } from '../approval.types';

// NOTE: Cristin projects cannot store a link to an approval, so the preview keeps the link in localStorage
const projectApprovalsStorageKey = 'kbs-preview-project-approvals';

type ApprovalsByProjectId = Record<string, Approval>;

const readAllProjectApprovals = (): ApprovalsByProjectId => {
  try {
    return JSON.parse(localStorage.getItem(projectApprovalsStorageKey) ?? '{}');
  } catch {
    return {};
  }
};

export const readProjectApproval = (projectId: string) => readAllProjectApprovals()[projectId] ?? null;

/** Saves the approval the project is based on, or removes the link when approval is null */
export const writeProjectApproval = (projectId: string, approval: Approval | null) => {
  const { [projectId]: _previousApproval, ...otherProjectApprovals } = readAllProjectApprovals();
  const projectApprovals = approval ? { ...otherProjectApprovals, [projectId]: approval } : otherProjectApprovals;
  localStorage.setItem(projectApprovalsStorageKey, JSON.stringify(projectApprovals));
};
