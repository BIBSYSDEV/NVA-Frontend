import { Box, Divider, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ApprovalTrialSite } from '../../../types/approval.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getResearchProfilePath } from '../../../utils/urlPaths';
import { getInvestigatorName, getTrialSiteAffiliation } from '../_utils/approval-view-helpers';

interface ApprovalMembersProps {
  trialSites: ApprovalTrialSite[];
}

export const ApprovalMembers = ({ trialSites }: ApprovalMembersProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Divider sx={{ borderColor: 'primary.main' }} />
      <Typography variant="h2" sx={{ my: '0.5rem' }}>
        {t('project.heading.members')}
      </Typography>
      <Box
        component="ul"
        data-testid={dataTestId.approvalLandingPage.membersList}
        sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {trialSites.map((trialSite, index) => {
          const investigatorName = getInvestigatorName(trialSite.investigator);
          const personId = trialSite.investigator?.person?.id;

          return (
            <li key={index}>
              <Typography>
                {personId ? (
                  <MuiLink component={Link} to={getResearchProfilePath(personId)}>
                    {investigatorName}
                  </MuiLink>
                ) : (
                  investigatorName
                )}
              </Typography>
              <Typography>{getTrialSiteAffiliation(trialSite)}</Typography>
            </li>
          );
        })}
      </Box>
    </>
  );
};
