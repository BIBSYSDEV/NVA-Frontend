import { Box } from '@mui/material';
import { ComponentProps } from 'react';
import { ProjectApprovalItem } from '../project-approval-item/ProjectApprovalItem';

interface ProjectApprovalListProps {
  approvals: ComponentProps<typeof ProjectApprovalItem>['approval'][];
}

export const ProjectApprovalList = ({ approvals }: ProjectApprovalListProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {approvals.map((approval) => (
      <ProjectApprovalItem key={`${approval.authority}-${approval.identifier}`} approval={approval} />
    ))}
  </Box>
);
