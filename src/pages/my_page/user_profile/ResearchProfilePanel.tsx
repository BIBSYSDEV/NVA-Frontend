import { Box, Divider, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PreviewIcon from '@mui/icons-material/Preview';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { CristinPerson } from '../../../types/user.types';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../../utils/user-helpers';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { useLocation } from 'react-router-dom';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { PageSpinner } from '../../../components/PageSpinner';
import { dataTestId } from '../../../utils/dataTestIds';
import { StyledBaseContributorIndicator } from '../../registration/contributors_tab/ContributorIndicator';
import { getContributorInitials } from '../../../utils/registration-helpers';
import { Fragment } from 'react';

interface ResearchProfilePanelProps {
  person?: CristinPerson;
  isLoadingPerson: boolean;
}

export const ResearchProfilePanel = ({ person, isLoadingPerson }: ResearchProfilePanelProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  const currentPath = location.pathname.replace(/\/$/, '').toLowerCase();
  const isPreview = currentPath === UrlPathTemplate.MyPageMyPersonalia;

  return (
    <>
      <Helmet>
        <title>{fullName}</title>
      </Helmet>
      <Box sx={{ bgcolor: 'person.main', height: '100%', padding: '0.5rem' }}>
        {isLoadingPerson ? (
          <PageSpinner aria-label={t('my_page.research_profile')} />
        ) : (
          <>
            {isPreview && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PreviewIcon />
                <Typography variant="h3" component="span" sx={{ textTransform: 'none' }}>
                  {t('my_page.my_profile.research_profile_summary.preview')}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', alignItems: 'center', mt: '1rem' }}>
              <Typography variant="h2">{t('my_page.my_profile.research_profile_summary.research_profile')}</Typography>
              <StyledBaseContributorIndicator
                sx={{ bgcolor: 'primary.main', color: 'white', height: '2.5rem', width: '2.5rem', fontSize: '1.5rem' }}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
                {getContributorInitials(fullName)}
              </StyledBaseContributorIndicator>
            </Box>

            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mt: '0.5rem' }}>
              <Typography variant="h3">{fullName}</Typography>
              {orcidUri && (
                <IconButton size="small" href={orcidUri} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
              )}
            </Box>

            <Typography sx={{ mt: '3rem', mb: '0.5rem' }} variant="h3">
              {t('my_page.my_profile.research_profile_summary.affiliations')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeAffiliations.map((affiliation, index) => (
                <Fragment key={index}>
                  <AffiliationHierarchy key={affiliation.organization + index} unitUri={affiliation.organization} />
                  <Divider />
                </Fragment>
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};
