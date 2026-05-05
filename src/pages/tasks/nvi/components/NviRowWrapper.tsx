import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Skeleton, styled, TableCell, TableRow } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../../../../types/organization.types';
import { getLanguageString } from '../../../../utils/translation-helpers';

export const StyledSkeleton = styled(Skeleton)({
  width: '2ch',
  margin: 'auto',
});

interface NviRowWrapperProps {
  organization: Organization;
  expanded: boolean;
  setExpanded: (val: boolean) => void;
  children?: ReactNode;
  level?: number;
}

export const NviRowWrapper = ({ children, level = 0, organization, expanded, setExpanded }: NviRowWrapperProps) => {
  const { t } = useTranslation();

  return (
    <TableRow sx={{ bgcolor: level % 2 === 0 ? undefined : 'white' }}>
      <TableCell sx={{ pl: `${1 + level * 1.5}rem`, py: '1rem' }}>{getLanguageString(organization.labels)}</TableCell>
      {children}
      <TableCell>
        {level !== 0 && organization.hasPart && organization.hasPart.length > 0 && (
          <IconButton
            onClick={() => setExpanded(!expanded)}
            title={t('tasks.nvi.show_subunits')}
            aria-label={t('tasks.nvi.show_subunits')}
            aria-expanded={expanded}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};
