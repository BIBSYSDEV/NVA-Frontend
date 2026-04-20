import { Link } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../../api/searchApi';
import { NviInstitutionStatusResponse } from '../../../../types/nvi.types';
import { Organization } from '../../../../types/organization.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { useNviCandidatesParams } from '../../../../utils/hooks/useNviCandidatesParams';
import { getNviCandidatesSearchPath } from '../../../../utils/urlPaths';
import { PercentageWithIcon } from '../../../_molecules/PercentageWithIcon';
import { HorizontalBox } from '../../../styled/Wrappers';
import { CenteredTableCell, TableNumberSkeleton } from '../../../tables/table-styles';
import { ALTERNATIVE_TEXT_INSTEAD_OF_ZERO } from '../utils/constants';
import { selfOrDescendantHasPointValues } from '../utils/nvi-curator-aggregations-helpers';
import { NviRowWrapper } from './NviRowWrapper';

interface NviPublicationPointsRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
  year?: number;
}

export const NviPublicationPointsRow = ({
  organization,
  aggregations,
  level = 0,
  year,
}: NviPublicationPointsRowProps) => {
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);

  if (excludeEmptyRows && !selfOrDescendantHasPointValues(organization, aggregations)) return null;

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

  const candidatesOthersMustApprove =
    (orgAggregations?.approvalStatus.Approved ?? 0) - (orgAggregations?.globalApprovalStatus.Approved ?? 0);

  return (
    <>
      <NviRowWrapper level={level} organization={organization} expanded={expanded} setExpanded={setExpanded}>
        <CenteredTableCell>
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
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
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
              {candidatesOthersMustApprove}
            </Link>
          ) : (
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>
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
            <TableNumberSkeleton />
          )}
        </CenteredTableCell>
        <CenteredTableCell>{aggregations ? pointsWithTwoDecimals : <TableNumberSkeleton />}</CenteredTableCell>
        <CenteredTableCell>
          {aggregations ? (
            <HorizontalBox sx={{ justifyContent: 'center' }}>
              <PercentageWithIcon
                displayPercentage={Math.floor(percentageApproved * 100)}
                alternativeIfZero={ALTERNATIVE_TEXT_INSTEAD_OF_ZERO}
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
          <NviPublicationPointsRow
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
