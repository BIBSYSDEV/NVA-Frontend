import React, { FC } from 'react';
import { CircularProgress, IconButton, Link as MuiLink, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import WorkIcon from '@material-ui/icons/Work';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import Card from '../../components/Card';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import useFetchAuthority from '../../utils/hooks/useFetchAuthority';
import { ORCID_BASE_URL } from '../../utils/constants';
import NormalText from '../../components/NormalText';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';
import SearchResults from '../search/SearchResults';

const StyledLine = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const StyledTextContainer = styled.div`
  width: 100%;
  margin-left: 1rem;
`;

const PublicProfile: FC = () => {
  const { arpId } = useParams<{ arpId: string }>();
  const [authority, isLoadingUser] = useFetchAuthority(arpId);
  const [registrations, isLoadingRegistrations] = useSearchRegistrations(arpId);

  return (
    <>
      {isLoadingUser || isLoadingRegistrations ? (
        <CircularProgress />
      ) : (
        authority && (
          <>
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
              {authority.orcids.map((orcid: string) => {
                const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
                return (
                  <StyledLine key={orcid}>
                    <IconButton size="small" href={orcidLink} key={orcid}>
                      <img src={orcidIcon} height="20" alt="orcid" />
                    </IconButton>
                    <StyledTextContainer>
                      <MuiLink href={orcidLink} target="_blank" rel="noopener noreferrer">
                        <NormalText>{orcidLink}</NormalText>
                      </MuiLink>
                    </StyledTextContainer>
                  </StyledLine>
                );
              })}
            </Card>
            {registrations && <SearchResults searchResult={registrations} />}
          </>
        )
      )}
    </>
  );
};

export default PublicProfile;
