import { Link, TableCell } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { PercentageWithIcon } from '../../../components/_molecules/PercentageWithIcon';
import { selfOrDescendantHasPointValues } from '../../../components/nvi/table/nvi-aggregations-helpers';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
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

  const rowOrDecendantHasPointValues = selfOrDescendantHasPointValues(organization, aggregations);

  if (excludeEmptyRows && !rowOrDecendantHasPointValues) return null;

  const orgAggregations = aggregations?.byOrganization[organization.id];
  const publicationPoints = orgAggregations?.points;
  const pointsWithTwoDecimals = (publicationPoints ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const percentageApproved =
    orgAggregations && orgAggregations.approvalStatus.Approved
      ? orgAggregations.globalApprovalStatus.Approved / orgAggregations.approvalStatus.Approved
      : -1;

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
              data-testid={dataTestId.nviStatusTableRow.approvedByUsLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: [NviCandidateStatusEnum.Approved],
                globalStatus: [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
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
              data-testid={dataTestId.nviStatusTableRow.candidatesOthersMustApproveLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: [NviCandidateStatusEnum.Approved],
                globalStatus: [NviCandidateGlobalStatusEnum.Pending],
                excludeSubUnits: true,
              })}>
              {(orgAggregations?.approvalStatus.Approved ?? 0) - (orgAggregations?.globalApprovalStatus.Approved ?? 0)}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.approvedByAllLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                globalStatus: NviCandidateGlobalStatusEnum.Approved,
                excludeSubUnits: true,
              })}>
              {orgAggregations?.globalApprovalStatus.Approved ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">{aggregations ? pointsWithTwoDecimals : <StyledSkeleton />}</TableCell>
        <TableCell align="center">
          {
            <HorizontalBox sx={{ justifyContent: 'center' }}>
              <PercentageWithIcon
                displayPercentage={Math.floor(percentageApproved * 100)}
                alternativeIfZero={'-'}
                hideWarningIcon
              />
            </HorizontalBox>
          }
        </TableCell>
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
