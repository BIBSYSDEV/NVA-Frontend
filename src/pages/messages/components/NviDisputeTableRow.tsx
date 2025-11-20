import { TableCell, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useState } from 'react';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { User } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { NviCandidateGlobalStatusEnum } from '../../../api/searchApi';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusTableRowWrapper, StyledSkeleton } from './NviStatusTableRowWrapper';

interface NviStatusTableRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
  user?: User | null;
  year?: number;
}

export const NviDisputeTableRow = ({ organization, aggregations, level = 0, user, year }: NviStatusTableRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);
  const orgAggregations = aggregations?.[organization.id];
  const shouldHideEmptyRow = excludeEmptyRows && (!orgAggregations || orgAggregations.docCount === 0);

  if (shouldHideEmptyRow) {
    return null;
  }

  return (
    <>
      <NviStatusTableRowWrapper
        level={level}
        organization={organization}
        aggregations={aggregations}
        expanded={expanded}
        setExpanded={setExpanded}>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.disputeLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                globalStatus: NviCandidateGlobalStatusEnum.Dispute,
              })}>
              {orgAggregations?.dispute?.docCount.toLocaleString() ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
      </NviStatusTableRowWrapper>
      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <NviDisputeTableRow
            key={subUnit.id}
            organization={subUnit}
            aggregations={aggregations}
            level={level + 1}
            user={user}
            year={year}
          />
        ))}
    </>
  );
};
