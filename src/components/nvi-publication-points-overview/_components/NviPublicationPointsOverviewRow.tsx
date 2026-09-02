import { Link } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { PercentageWithIcon } from '../../_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../styled/Wrappers';
import { CenteredTableCell, TableNumberSkeleton } from '../../tables/table-styles';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { NviRowWrapper } from '../../NviRowWrapper';
import { selfOrDescendantHasPointValues } from '../../../utils/nvi-curator-aggregations-helpers';

interface NviPublicationPointsOverviewRowProps {
  organization: Organization;
  statusData?: NviInstitutionStatusResponse;
  level?: number;
  year?: number;
  /** Whether the candidate counts link to the NVI candidate search (curator context) or render as plain text. */
  linkable: boolean;
}

export const NviPublicationPointsOverviewRow = ({
  organization,
  statusData,
  level = 0,
  year,
  linkable,
}: NviPublicationPointsOverviewRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);

  if (excludeEmptyRows && !selfOrDescendantHasPointValues(organization, statusData)) return null;

  const orgAggregations = statusData?.byOrganization[organization.id];
  const publicationPoints = orgAggregations?.points;
  const pointsWithTwoDecimals = (publicationPoints ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const approvedByUs = orgAggregations?.approvalStatus.Approved ?? 0;
  const approvedByAll = orgAggregations?.globalApprovalStatus.Approved ?? 0;
  const candidatesOthersMustApprove = approvedByUs - approvedByAll;

  const percentageApproved =
    orgAggregations && orgAggregations.approvalStatus.Approved
      ? orgAggregations.globalApprovalStatus.Approved / orgAggregations.approvalStatus.Approved
      : -1;

  return (
    <>
      <NviRowWrapper level={level} organization={organization} expanded={expanded} setExpanded={setExpanded}>
        <CenteredTableCell>
          {!statusData ? (
            <TableNumberSkeleton />
          ) : linkable ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.approvedByUsLink}
              to={getNviCandidatesSearchPath({
                year,
                orgNumber: getIdentifierFromId(organization.id),
                status: [NviCandidateStatusEnum.Approved],
                globalStatus: [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
                excludeSubUnits: true,
              })}>
              {approvedByUs}
            </Link>
          ) : (
            approvedByUs
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!statusData ? (
            <TableNumberSkeleton />
          ) : linkable ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.candidatesOthersMustApproveLink}
              to={getNviCandidatesSearchPath({
                year,
                orgNumber: getIdentifierFromId(organization.id),
                status: [NviCandidateStatusEnum.Approved],
                globalStatus: [NviCandidateGlobalStatusEnum.Pending],
                excludeSubUnits: true,
              })}>
              {candidatesOthersMustApprove}
            </Link>
          ) : (
            candidatesOthersMustApprove
          )}
        </CenteredTableCell>
        <CenteredTableCell>
          {!statusData ? (
            <TableNumberSkeleton />
          ) : linkable ? (
            <Link
              component={RouterLink}
              data-testid={dataTestId.nviStatusTableRow.approvedByAllLink}
              to={getNviCandidatesSearchPath({
                year,
                orgNumber: getIdentifierFromId(organization.id),
                globalStatus: NviCandidateGlobalStatusEnum.Approved,
                excludeSubUnits: true,
              })}>
              {approvedByAll}
            </Link>
          ) : (
            approvedByAll
          )}
        </CenteredTableCell>
        <CenteredTableCell>{statusData ? pointsWithTwoDecimals : <TableNumberSkeleton />}</CenteredTableCell>
        <CenteredTableCell>
          {statusData ? (
            <HorizontalBox sx={{ justifyContent: 'center' }}>
              <PercentageWithIcon
                displayPercentage={Math.floor(percentageApproved * 100)}
                alternativeIfZero={'-'}
                hideWarningIcon
              />
            </HorizontalBox>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
      </NviRowWrapper>
      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <NviPublicationPointsOverviewRow
            key={subUnit.id}
            organization={subUnit}
            statusData={statusData}
            level={level + 1}
            year={year}
            linkable={linkable}
          />
        ))}
    </>
  );
};
