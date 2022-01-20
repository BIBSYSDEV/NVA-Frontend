import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Box, IconButton, Link as MuiLink, SxProps, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { Helmet } from 'react-helmet-async';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { PageHeader } from '../../components/PageHeader';
import { BackgroundDiv, SyledPageContent } from '../../components/styled/Wrappers';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { Authority } from '../../types/authority.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResults } from '../search/SearchResults';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';

const textContainerSx: SxProps = {
  width: '100%',
};

const lineSx: SxProps = {
  display: 'flex',
  gap: '1rem',
  mt: '1rem',
};

const PublicProfile = () => {
  const { t } = useTranslation('profile');
  const history = useHistory();
  const arpId = new URLSearchParams(history.location.search).get('id') ?? '';

  const [authority, isLoadingUser] = useFetch<Authority>({
    url: arpId,
    errorMessage: t('feedback:error.get_authority'),
  });
  const [registrations, isLoadingRegistrations] = useSearchRegistrations({
    properties: [
      {
        fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
        value: arpId,
        operator: ExpressionStatement.Contains,
      },
    ],
  });

  return (
    <SyledPageContent>
      <PageHeader>{t('public_profile')}</PageHeader>
      {isLoadingUser || isLoadingRegistrations ? (
        <PageSpinner />
      ) : (
        authority && (
          <BackgroundDiv>
            <Helmet>
              <title>{authority.name}</title>
            </Helmet>
            <Typography variant="h2">{authority.name}</Typography>
            {authority.orgunitids.length > 0 && (
              <Box sx={lineSx}>
                <WorkIcon />
                <Box sx={textContainerSx}>
                  {authority.orgunitids.map((unitId) => (
                    <AffiliationHierarchy key={unitId} unitUri={unitId} commaSeparated />
                  ))}
                </Box>
              </Box>
            )}
            {authority.orcids.map((orcid) => (
              <Box sx={lineSx} key={orcid}>
                <IconButton size="small" href={orcid} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
                <Box sx={textContainerSx}>
                  <Typography component={MuiLink} href={orcid} target="_blank" rel="noopener noreferrer">
                    {orcid}
                  </Typography>
                </Box>
              </Box>
            ))}
            {registrations && (
              <Box sx={{ mt: '1rem' }}>
                <Typography variant="h2">{t('common:registrations')}</Typography>
                {registrations.total > 0 ? (
                  <SearchResults searchResult={registrations} />
                ) : (
                  <Typography>{t('common:no_hits')}</Typography>
                )}
              </Box>
            )}
          </BackgroundDiv>
        )
      )}
    </SyledPageContent>
  );
};

export default PublicProfile;
