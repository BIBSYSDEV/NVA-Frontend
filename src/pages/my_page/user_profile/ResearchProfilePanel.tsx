import { Box, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import PreviewIcon from '@mui/icons-material/Preview';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { CristinPerson } from '../../../types/user.types';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../../utils/user-helpers';
import { AccountCircle } from '@mui/icons-material';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { useLocation } from 'react-router-dom';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { PageSpinner } from '../../../components/PageSpinner';
import { BackgroundDiv } from '../../../components/styled/Wrappers';

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
  const isPreview = currentPath === UrlPathTemplate.MyPageMyProfile;

  return (
    <>
      <Helmet>
        <title>{fullName}</title>
      </Helmet>
      <BackgroundDiv sx={{ bgcolor: 'secondary.main', height: '100%', padding: '1rem' }}>
        {isLoadingPerson ? (
          <PageSpinner aria-label={t('my_page.research_profile')} />
        ) : (
          <>
            {isPreview && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PreviewIcon />
                <Typography variant="h3" component="span" sx={{ textTransform: 'none' }}>
                  {t('my_page.my_profile.research_profile_summary.preview')}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', alignItems: 'center' }}>
              <Typography variant="h2" component="h1">
                {t('my_page.my_profile.research_profile_summary.research_profile')}
              </Typography>
              <AccountCircle sx={{ fontSize: '3rem' }} />
            </Box>

            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Typography variant="h3" component="h2">
                {fullName}
              </Typography>
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
              {activeAffiliations.map((affiliation) => (
                <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />
              ))}
            </Box>
          </>
        )}
      </BackgroundDiv>
    </>
  );
};
