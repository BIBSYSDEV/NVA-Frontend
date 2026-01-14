import { TableCell, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useState } from 'react';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { NviStatusTableRowWrapper, StyledSkeleton } from './NviStatusTableRowWrapper';

interface NviStatusTableRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
  year?: number;
}

export const NviPublicationPointsTableRow = ({
  organization,
  aggregations,
  level = 0,
  year,
}: NviStatusTableRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);
  const orgAggregations = aggregations?.byOrganization[organization.id];
  const rowIsEmpty = !orgAggregations || orgAggregations.candidateCount === 0;

  if (rowIsEmpty && excludeEmptyRows) {
    return null;
  }

  const publicationPoints = orgAggregations?.points;
  const pointsWithTwoDecimals = publicationPoints
    ? publicationPoints.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : 0;

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
              data-testid={dataTestId.nviStatusTableRow.candidateLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Approved,
                globalStatus: [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.Approved ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">{aggregations ? pointsWithTwoDecimals : <StyledSkeleton />}</TableCell>
      </NviStatusTableRowWrapper>
      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <NviPublicationPointsTableRow
            key={subUnit.id}
            organization={subUnit}
            aggregations={aggregations}
            level={level + 1}
            year={year}
          />
        ))}
    </>
  );
};
