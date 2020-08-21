import React, { FC, useEffect } from 'react';
import { CircularProgress, IconButton, Link as MuiLink } from '@material-ui/core';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import useFetchAuthority from '../../utils/hooks/useFetchAuthority';
import { ORCID_BASE_URL } from '../../utils/constants';
import NormalText from '../../components/NormalText';
import WorkIcon from '@material-ui/icons/Work';

const StyledUserInfo = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.palette.background.default};
  align-content: flex-start;
  width: 100%;
  padding: 0.5rem;
`;

const StyledLine = styled.div`
  display: grid;
  grid-template-areas: 'icon text';
  gap: 1rem;
  justify-content: start;
  margin-top: 1rem;
`;

const StyledTextContainer = styled.div`
  grid-area: text;
`;

const PublicProfile: FC = () => {
  const { arpId } = useParams<{ arpId: string }>();
  const [authority, isLoadingUser] = useFetchAuthority(arpId);
  const history = useHistory();

  useEffect(() => {
    history.replace(`/user/${arpId}`, { title: authority?.name });
  }, [history, arpId, authority]);

  return (
    <>
      {isLoadingUser ? (
        <CircularProgress />
      ) : (
        authority && (
          <StyledUserInfo>
            <Card>
              <Heading>{authority.name}</Heading>
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
                    <MuiLink href={orcidLink} target="_blank" rel="noopener noreferrer">
                      <NormalText>{orcidLink}</NormalText>
                    </MuiLink>
                  </StyledLine>
                );
              })}
            </Card>
          </StyledUserInfo>
        )
      )}
    </>
  );
};

export default PublicProfile;
