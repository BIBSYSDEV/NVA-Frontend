import { useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useState } from 'react';
import { getProjectApprovalQueryKey } from './_hooks/useProjectApproval';
import { readProjectApproval, writeProjectApproval } from './_utils/project-approval-storage';
import { Approval } from './approval.types';

interface ApprovalDraft {
  approval: Approval | null;
  setApproval: (approval: Approval | null) => void;
  saveApprovalForProject: (projectId: string) => void;
}

/* The approval chosen while creating or editing a project. It can only be saved once the project has an id */
const ApprovalDraftContext = createContext<ApprovalDraft>({
  approval: null,
  setApproval: () => {},
  saveApprovalForProject: () => {},
});

interface ApprovalDraftProviderProps {
  projectId?: string;
  children: ReactNode;
}

export const ApprovalDraftProvider = ({ projectId, children }: ApprovalDraftProviderProps) => {
  const queryClient = useQueryClient();
  const [approval, setApproval] = useState(() => (projectId ? readProjectApproval(projectId) : null));

  const saveApprovalForProject = (savedProjectId: string) => {
    writeProjectApproval(savedProjectId, approval);
    queryClient.setQueryData(getProjectApprovalQueryKey(savedProjectId), approval);
  };

  return (
    <ApprovalDraftContext.Provider value={{ approval, setApproval, saveApprovalForProject }}>
      {children}
    </ApprovalDraftContext.Provider>
  );
};

export const useApprovalDraft = () => useContext(ApprovalDraftContext);
