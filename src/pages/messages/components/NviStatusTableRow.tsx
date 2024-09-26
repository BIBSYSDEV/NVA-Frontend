import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Skeleton, styled, TableCell, TableRow } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviStatusTableRowProps {
  organization: Organization;
  aggregations?: NviInstitutionStatusResponse;
  level?: number;
}

const StyledSkeleton = styled(Skeleton)({
  width: '2ch',
  margin: 'auto',
});

export const NviStatusTableRow = ({ organization, aggregations, level = 0 }: NviStatusTableRowProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(level === 0);
  const orgAggregations = aggregations?.[organization.id];
  aggregations = undefined;

  return (
    <>
      <TableRow sx={{ bgcolor: level % 2 === 0 ? undefined : '#FEFBF3' }}>
        <TableCell sx={{ pl: `${1 + level * 1.5}rem`, py: '1rem' }}>{getLanguageString(organization.labels)}</TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.status.New?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.status.Pending?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.status.Approved?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.status.Rejected?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (
            (orgAggregations?.points.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 0)
          ) : (
            <StyledSkeleton />
          )}
        </TableCell>
        <TableCell align="center">
          {aggregations ? (orgAggregations?.dispute?.docCount.toLocaleString() ?? 0) : <StyledSkeleton />}
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
          <NviStatusTableRow key={subUnit.id} organization={subUnit} aggregations={aggregations} level={level + 1} />
        ))}
    </>
  );
};
