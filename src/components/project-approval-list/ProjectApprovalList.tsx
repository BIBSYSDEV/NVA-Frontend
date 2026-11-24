import { Box, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useFetchApprovalByIdentifier } from '../../api/hooks/useFetchApprovalByIdentifier';
import { ProjectApproval } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';

type ListedApproval = Pick<ProjectApproval, 'authority' | 'identifier'> &
  Partial<Pick<ProjectApproval, 'authorityName'>>;

interface ProjectApprovalListProps {
  approvals: ListedApproval[];
}

export const ProjectApprovalList = ({ approvals }: ProjectApprovalListProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {approvals.map((approval) => (
      <ProjectApprovalItem key={`${approval.authority}-${approval.identifier}`} approval={approval} />
    ))}
  </Box>
);

interface ProjectApprovalItemProps {
  approval: ListedApproval;
}

/** Shows the title from the approval API when the approval is found there, and the authority name otherwise */
const ProjectApprovalItem = ({ approval }: ProjectApprovalItemProps) => {
  const approvalQuery = useFetchApprovalByIdentifier(approval);
  const foundApproval = approvalQuery.data;

  return (
    <Box>
      {approvalQuery.isLoading ? (
        <Skeleton width="60%" />
      ) : foundApproval ? (
        <MuiLink
          href={foundApproval.handle}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={dataTestId.common.projectApprovalLink}>
          {foundApproval.title}
        </MuiLink>
      ) : (
        <Typography>{getLanguageString(approval.authorityName)}</Typography>
      )}
      <Typography>{approval.identifier}</Typography>
    </Box>
  );
};
