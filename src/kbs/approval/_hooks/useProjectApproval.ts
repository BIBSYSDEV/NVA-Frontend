import { useQuery } from '@tanstack/react-query';
import { readProjectApproval } from '../_utils/project-approval-storage';

export const getProjectApprovalQueryKey = (projectId: string) => ['kbsProjectApproval', projectId];

/** The approval the project is based on, if any */
export const useProjectApproval = (projectId: string) =>
  // NOTE: The data is read synchronously from localStorage, so it is always available
  useQuery({
    queryKey: getProjectApprovalQueryKey(projectId),
    queryFn: () => readProjectApproval(projectId),
    initialData: () => readProjectApproval(projectId),
    staleTime: Infinity,
  });
