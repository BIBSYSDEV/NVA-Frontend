import { Link } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { User } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { selfOrDescendantHasCandidates } from '../../../utils/nvi-curator-aggregations-helpers';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { PercentageWithIcon } from '../../_molecules/PercentageWithIcon';
import { NviRowWrapper } from '../../NviRowWrapper';
import { HorizontalBox } from '../../styled/Wrappers';
import { CenteredTableCell, TableNumberSkeleton } from '../../tables/table-styles';

interface NviReportingStatusRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
  user?: User | null;
  year?: number;
  /** Whether the candidate counts link to the NVI candidate search (curator context) or render as plain text. */
  linkable?: boolean;
}

export const NviReportingStatusOverviewRow = ({
  organization,
  aggregations,
  level = 0,
  user,
  year,
  linkable = false,
}: NviReportingStatusRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);

  if (excludeEmptyRows && !selfOrDescendantHasCandidates(organization, aggregations)) return null;

  const orgAggregations = aggregations?.byOrganization[organization.id];

  const candidates = orgAggregations?.approvalStatus.New ?? 0;
  const pending = orgAggregations?.approvalStatus.Pending ?? 0;
  const approved = orgAggregations?.approvalStatus.Approved ?? 0;
  const rejected = orgAggregations?.approvalStatus.Rejected ?? 0;
  const candidateCount = orgAggregations?.candidateCount ?? 0;

  const percentageControlled =
    orgAggregations && orgAggregations.candidateCount > 0
      ? (orgAggregations.approvalStatus.Approved + orgAggregations.approvalStatus.Rejected) /
        orgAggregations.candidateCount
      : -1;

  return (
    <>
      <NviRowWrapper level={level} organization={organization} expanded={expanded} setExpanded={setExpanded}>
        <CenteredTableCell>
          {!aggregations ? (
            <TableNumberSkeleton />
          ) : linkable ? (
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
              {candidates}
            </Link>
          ) : (
            candidates
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!aggregations ? (
            <TableNumberSkeleton />
          ) : linkable ? (
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
              {pending}
            </Link>
          ) : (
            pending
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!aggregations ? (
            <TableNumberSkeleton />
          ) : linkable ? (
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
              {approved}
            </Link>
          ) : (
            approved
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!aggregations ? (
            <TableNumberSkeleton />
          ) : linkable ? (
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
              {rejected}
            </Link>
          ) : (
            rejected
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!aggregations ? (
            <TableNumberSkeleton />
          ) : linkable ? (
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
              {candidateCount}
            </Link>
          ) : (
            candidateCount
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
      </NviRowWrapper>

      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <NviReportingStatusOverviewRow
            key={subUnit.id}
            organization={subUnit}
            aggregations={aggregations}
            level={level + 1}
            user={user}
            year={year}
            linkable={linkable}
          />
        ))}
    </>
  );
};
