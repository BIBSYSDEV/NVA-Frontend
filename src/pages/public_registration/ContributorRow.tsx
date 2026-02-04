import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Contributor, ContributorRole } from '../../types/contributor.types';
import { useCheckWhichOrgsAreNviInstitutions } from '../../utils/hooks/useCheckWhichOrgsAreNviInstitutions';
import { getDistinctContributorUnits } from '../../utils/institutions-helpers';
import { ContributorItem } from './ContributorItem';

interface ContributorsRowProps {
  contributors: Contributor[];
  distinctUnits: string[];
  hiddenCount?: number;
  relevantRoles: ContributorRole[];
}

export const ContributorsRow = ({ contributors, distinctUnits, hiddenCount, relevantRoles }: ContributorsRowProps) => {
  const { t } = useTranslation();
  const orgNviStatuses = useCheckWhichOrgsAreNviInstitutions(
    getDistinctContributorUnits(contributors.filter((c) => !c.identity.id)) // Check is only relevant for organizations affiliated with unidentified contributors, because we want to highlight unidentified contributors affiliated with NVI institutions on the landing page
  );

  return (
    <Box
      component="ul"
      sx={{
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        '> :not(:first-of-type)': {
          ml: '1rem', // Use margin instead of gap to indent wrapped elements
        },
      }}>
      {contributors.map((contributor, index) => (
        <ContributorItem
          key={index}
          contributor={contributor}
          distinctUnits={distinctUnits}
          orgNviStatuses={orgNviStatuses}
          relevantRoles={relevantRoles}
          showSeparator={index < contributors.length - 1}
        />
      ))}
      {hiddenCount && hiddenCount > 0 ? (
        <Typography component="li">
          {t('registration.public_page.other_contributors', { count: hiddenCount })}
        </Typography>
      ) : null}
    </Box>
  );
};
