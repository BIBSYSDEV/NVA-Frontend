import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { IconButton, Link as MuiLink, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { Helmet } from 'react-helmet';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { Authority } from '../../types/authority.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResults } from '../search/SearchResults';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { BackgroundDiv } from '../../components/BackgroundDiv';

const StyledLine = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const StyledTextContainer = styled.div`
  width: 100%;
  margin-left: 1rem;
`;

const StyledRegistrations = styled.div`
  margin-top: 1rem;
  width: 100%;
`;

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
    <StyledPageWrapperWithMaxWidth>
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
              <StyledLine>
                <WorkIcon />
                <StyledTextContainer>
                  {authority.orgunitids.map((unitId) => (
                    <AffiliationHierarchy key={unitId} unitUri={unitId} commaSeparated />
                  ))}
                </StyledTextContainer>
              </StyledLine>
            )}
            {authority.orcids.map((orcid) => (
              <StyledLine key={orcid}>
                <IconButton size="small" href={orcid} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
                <StyledTextContainer>
                  <Typography component={MuiLink} href={orcid} target="_blank" rel="noopener noreferrer">
                    {orcid}
                  </Typography>
                </StyledTextContainer>
              </StyledLine>
            ))}
            {registrations && (
              <StyledRegistrations>
                <Typography variant="h2">{t('common:registrations')}</Typography>
                {registrations.total > 0 ? (
                  <SearchResults searchResult={registrations} />
                ) : (
                  <Typography>{t('common:no_hits')}</Typography>
                )}
              </StyledRegistrations>
            )}
          </BackgroundDiv>
        )
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default PublicProfile;
