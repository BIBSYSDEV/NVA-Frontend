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
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResults } from '../search/SearchResults';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { CristinPerson } from '../../types/user.types';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../utils/user-helpers';

const textContainerSx: SxProps = {
  width: '100%',
};

const lineSx: SxProps = {
  display: 'flex',
  gap: '1rem',
  mt: '1rem',
};

const PublicProfile = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const personId = new URLSearchParams(history.location.search).get('id') ?? '';

  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback:error.get_person'),
  });

  const [registrations, isLoadingRegistrations] = useSearchRegistrations({
    properties: [
      {
        fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
        value: personId,
        operator: ExpressionStatement.Contains,
      },
    ],
  });

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return (
    <SyledPageContent>
      <PageHeader>{t('myPage:public_profile')}</PageHeader>
      {isLoadingPerson || isLoadingRegistrations ? (
        <PageSpinner />
      ) : (
        person && (
          <BackgroundDiv>
            <Helmet>
              <title>{fullName}</title>
            </Helmet>
            <Typography variant="h2">{fullName}</Typography>
            {activeAffiliations.length > 0 && (
              <Box sx={lineSx}>
                <WorkIcon />
                <Box sx={textContainerSx}>
                  {activeAffiliations.map(({ organization }) => (
                    <AffiliationHierarchy key={organization} unitUri={organization} commaSeparated />
                  ))}
                </Box>
              </Box>
            )}
            {orcidUri && (
              <Box sx={lineSx}>
                <IconButton size="small" href={orcidUri} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
                <Box sx={textContainerSx}>
                  <Typography component={MuiLink} href={orcidUri} target="_blank" rel="noopener noreferrer">
                    {orcidUri}
                  </Typography>
                </Box>
              </Box>
            )}
            {registrations && (
              <Box sx={{ mt: '1rem' }}>
                <Typography variant="h2">{t('registrations')}</Typography>
                {registrations.size > 0 ? (
                  <SearchResults searchResult={registrations} />
                ) : (
                  <Typography>{t('no_hits')}</Typography>
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
