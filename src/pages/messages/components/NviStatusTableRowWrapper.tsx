import { Skeleton, styled, TableCell, TableRow, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';
import { NviInstitutionStatusResponse } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { getLanguageString } from '../../../utils/translation-helpers';
import { useNviCandidatesParams } from '../../../utils/hooks/useNviCandidatesParams';
import { useTranslation } from 'react-i18next';

export const StyledSkeleton = styled(Skeleton)({
  width: '2ch',
  margin: 'auto',
});

interface NviStatusTableRowWrapperProps {
  organization: Organization;
  expanded: boolean;
  setExpanded: (val: boolean) => void;
  children?: ReactNode;
  level?: number;
  aggregations?: NviInstitutionStatusResponse;
}

export const NviStatusTableRowWrapper = ({
  children,
  level = 0,
  organization,
  aggregations,
  expanded,
  setExpanded,
}: NviStatusTableRowWrapperProps) => {
  const { t } = useTranslation();
  const { excludeEmptyRows } = useNviCandidatesParams();
  const orgAggregations = aggregations?.byOrganization[organization.id];
  const isEmpty = !orgAggregations || orgAggregations.candidateCount === 0;

  if (excludeEmptyRows && isEmpty) {
    return null;
  }

  return (
    <TableRow sx={{ bgcolor: level % 2 === 0 ? undefined : 'white' }}>
      <TableCell sx={{ pl: `${1 + level * 1.5}rem`, py: '1rem' }}>{getLanguageString(organization.labels)}</TableCell>
      {children}
      <TableCell>
        {level !== 0 && organization.hasPart && organization.hasPart.length > 0 && (
          <IconButton onClick={() => setExpanded(!expanded)} title={t('tasks.nvi.show_subunits')}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};
