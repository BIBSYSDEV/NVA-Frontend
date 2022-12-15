import { Box, Divider, IconButton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PreviewIcon from '@mui/icons-material/Preview';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { useFetch } from '../../../utils/hooks/useFetch';
import { CristinPerson } from '../../../types/user.types';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../../utils/user-helpers';
import { AccountCircle } from '@mui/icons-material';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { useHistory, useLocation } from 'react-router-dom';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import { PageSpinner } from '../../../components/PageSpinner';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { Helmet } from 'react-helmet-async';

export const ResearchProfilePanel = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = history.location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(history.location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback.error.get_person'),
  });

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, '').toLowerCase();
  const isPreview = currentPath === UrlPathTemplate.MyPageMyProfile;

  return (
    <>
      <Helmet>
        <title>{fullName}</title>
      </Helmet>
      <BackgroundDiv sx={{ height: '100%', bgcolor: 'secondary.main', padding: '1rem' }}>
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
                <Box>
                  <IconButton size="small" href={orcidUri} target="_blank">
                    <img src={orcidIcon} height="20" alt="orcid" />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Divider sx={{ mt: '3rem' }} />
            {activeAffiliations.map((affiliation) => {
              return <AffiliationHierarchy key={affiliation.organization} unitUri={affiliation.organization} />;
            })}
          </>
        )}
      </BackgroundDiv>
    </>
  );
};
