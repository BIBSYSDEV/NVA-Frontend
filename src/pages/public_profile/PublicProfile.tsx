import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { IconButton, Link as MuiLink, Typography } from '@material-ui/core';
import WorkIcon from '@material-ui/icons/Work';
import { Helmet } from 'react-helmet';
import { Card } from '../../components/Card';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { SearchFieldName } from '../../types/search.types';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { Authority } from '../../types/authority.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResults } from '../search/SearchResults';

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
    properties: [{ fieldName: SearchFieldName.ContributorId, value: arpId }],
  });

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('public_profile')}</PageHeader>
      {isLoadingUser || isLoadingRegistrations ? (
        <PageSpinner />
      ) : (
        authority && (
          <>
            <Helmet>
              <title>{authority.name}</title>
            </Helmet>
            <Card>
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
                  <IconButton size="small" href={orcid}>
                    <img src={orcidIcon} height="20" alt="orcid" />
                  </IconButton>
                  <StyledTextContainer>
                    <Typography component={MuiLink} href={orcid} target="_blank" rel="noopener noreferrer">
                      {orcid}
                    </Typography>
                  </StyledTextContainer>
                </StyledLine>
              ))}
            </Card>
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
          </>
        )
      )}
    </StyledPageWrapperWithMaxWidth>
  );
};

export default PublicProfile;
