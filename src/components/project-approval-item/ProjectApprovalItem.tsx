import { Box, Link as MuiLink, Skeleton, Typography } from '@mui/material';
import { useFetchApprovalByIdentifier } from '../../api/hooks/useFetchApprovalByIdentifier';
import { ProjectApproval } from '../../types/project.types';
import { getLanguageString } from '../../utils/translation-helpers';

interface ProjectApprovalItemProps {
  approval: Pick<ProjectApproval, 'identifier'> & Partial<Pick<ProjectApproval, 'authorityName'>>;
}

/** Shows the title from the approval API when the approval is found there, and the authority name otherwise */
export const ProjectApprovalItem = ({ approval }: ProjectApprovalItemProps) => {
  const approvalQuery = useFetchApprovalByIdentifier(approval.identifier);
  const foundApproval = approvalQuery.data;

  return (
    <Box>
      {approvalQuery.isPending ? (
        <Skeleton width="60%" />
      ) : foundApproval ? (
        <MuiLink href={foundApproval.handle} target="_blank" rel="noopener noreferrer">
          {foundApproval.title}
        </MuiLink>
      ) : (
        <Typography>{getLanguageString(approval.authorityName)}</Typography>
      )}
      <Typography>{approval.identifier}</Typography>
    </Box>
  );
};
