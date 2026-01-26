import { Link, Skeleton, styled, TableCell } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { User } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { NviStatusTableRowWrapper } from './NviStatusTableRowWrapper';

interface NviStatusTableRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
  user?: User | null;
  year?: number;
}

const StyledSkeleton = styled(Skeleton)({
  width: '2ch',
  margin: 'auto',
});

export const NviStatusTableRow = ({ organization, aggregations, level = 0, user, year }: NviStatusTableRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);
  const orgAggregations = aggregations?.byOrganization[organization.id];
  const rowIsEmpty = !orgAggregations || orgAggregations.candidateCount === 0;

  if (rowIsEmpty && excludeEmptyRows) {
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
              data-testid={dataTestId.nviStatusTableRow.candidateLink}
              to={getNviCandidatesSearchPath({
                username: user?.nvaUsername,
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Pending,
                globalStatus: NviCandidateGlobalStatusEnum.Pending,
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.New ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.candidateLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Pending,
                globalStatus: NviCandidateGlobalStatusEnum.Pending,
                excludeUnassigned: true,
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.Pending ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.approvedLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Approved,
                globalStatus: [
                  NviCandidateGlobalStatusEnum.Approved,
                  NviCandidateGlobalStatusEnum.Pending,
                  NviCandidateGlobalStatusEnum.Dispute,
                ],
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.Approved ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.rejectedLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Rejected,
                globalStatus: NviCandidateGlobalStatusEnum.Rejected,
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.Rejected ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.totalAmountLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                excludeSubUnits: true,
              })}>
              {orgAggregations?.candidateCount ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
      </NviStatusTableRowWrapper>

      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <NviStatusTableRow
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
