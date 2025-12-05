import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Skeleton, styled, TableCell, TableRow, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { dataTestId } from '../../../utils/dataTestIds';
import { getNviCandidatesSearchPath } from '../../../utils/urlPaths';
import { User } from '../../../types/user.types';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { NviCandidateGlobalStatusEnum, NviCandidateStatusEnum } from '../../../api/searchApi';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';

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
  const { t } = useTranslation();
  const { excludeEmptyRows } = useNviCandidatesParams();
  const [expanded, setExpanded] = useState(level === 0);
  const orgAggregations = aggregations?.byOrganization[organization.id];
  const shouldHideEmptyRow = excludeEmptyRows && (!orgAggregations || orgAggregations.candidateCount === 0);

  if (shouldHideEmptyRow) {
    return null;
  }

  return (
    <>
      <TableRow sx={{ bgcolor: level % 2 === 0 ? undefined : 'white' }}>
        <TableCell sx={{ pl: `${1 + level * 1.5}rem`, py: '1rem' }}>{getLanguageString(organization.labels)}</TableCell>
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
              })}>
              {orgAggregations?.candidateCount ?? 0}
            </Link>
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            (orgAggregations?.points.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 0)
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell>
          {level !== 0 && organization.hasPart && organization.hasPart.length > 0 && (
            <IconButton onClick={() => setExpanded(!expanded)} title={t('tasks.nvi.show_subunits')}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>

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
