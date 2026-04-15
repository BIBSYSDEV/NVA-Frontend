import { Link } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { PercentageWithIcon } from '../../../components/_molecules/PercentageWithIcon';
import { selfOrDescendantHasCandidates } from '../../../components/nvi/table/utils/nvi-aggregations-helpers';
import { HorizontalBox } from '../../../components/styled/Wrappers';
import { CenteredTableCell, TableNumberSkeleton } from '../../../styles/table-styles';
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

export const NviStatusTableRow = ({ organization, aggregations, level = 0, user, year }: NviStatusTableRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);

  const rowOrDescendantHasCandidates = selfOrDescendantHasCandidates(organization, aggregations);

  if (excludeEmptyRows && !rowOrDescendantHasCandidates) return null;

  const orgAggregations = aggregations?.byOrganization[organization.id];
  const percentageControlled =
    orgAggregations && orgAggregations.candidateCount > 0
      ? (orgAggregations.approvalStatus.Approved + orgAggregations.approvalStatus.Rejected) /
        orgAggregations.candidateCount
      : -1;

  return (
    <>
      <NviStatusTableRowWrapper level={level} organization={organization} expanded={expanded} setExpanded={setExpanded}>
        <CenteredTableCell>
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.candidateLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.New,
                globalStatus: NviCandidateGlobalStatusEnum.Pending,
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.New ?? 0}
            </Link>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
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
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.approvedLink}
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
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.rejectedLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                status: NviCandidateStatusEnum.Rejected,
                globalStatus: [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
                excludeSubUnits: true,
              })}>
              {orgAggregations?.approvalStatus.Rejected ?? 0}
            </Link>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {aggregations ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.totalAmountLink}
              to={getNviCandidatesSearchPath({
                year: year,
                orgNumber: getIdentifierFromId(organization.id),
                globalStatus: [
                  NviCandidateGlobalStatusEnum.Approved,
                  NviCandidateGlobalStatusEnum.Rejected,
                  NviCandidateGlobalStatusEnum.Pending,
                ],
                excludeSubUnits: true,
              })}>
              {orgAggregations?.candidateCount ?? 0}
            </Link>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {aggregations ? (
            <HorizontalBox sx={{ justifyContent: 'center' }}>
              <PercentageWithIcon
                displayPercentage={Math.floor(percentageControlled * 100)}
                displayEmpty={percentageControlled < 0}
              />
            </HorizontalBox>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
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
