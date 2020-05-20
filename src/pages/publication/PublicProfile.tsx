import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { PublishedPublicationPreview } from '../../types/publication.types';
import PublishedPublicationList from './PublishedPublicationList';
import Card from '../../components/Card';
import LabelTextLine from './../../components/LabelTextLine';
import Heading from '../../components/Heading';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import useFetchAuthority from '../../utils/hooks/useFetchAuthority';
import { ORCID_BASE_URL } from '../../utils/constants';

const StyledWrapper = styled.div`
  text-align: center;
  padding: 0.5rem;
  width: 100%;
`;

const StyledUserInfo = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.palette.background.default};
  align-content: flex-start;
  width: 100%;
  padding: 0.5rem;
`;

const PublicProfile: FC = () => {
  const { t } = useTranslation('profile');
  const { arpId } = useParams();
  const [authority, isLoadingUser] = useFetchAuthority(arpId);

  return (
    <>
      {isLoadingUser ? (
        <CircularProgress />
      ) : (
        authority && (
          <>
            <StyledUserInfo>
              <Card>
                <Heading>{authority.name}</Heading>
                {authority.orgunitids.length > 0 && (
                  <LabelTextLine label={t('heading.organizations')}>
                    {authority.orgunitids.map((unitId) => (
                      <AffiliationHierarchy key={unitId} unitUri={unitId} commaSeparated />
                    ))}
                  </LabelTextLine>
                )}
                {authority?.orcids.map((orcid: string) => {
                  const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
                  return (
                    <LabelTextLine
                      key={orcid}
                      dataTestId={'orcid-info'}
                      label={t('orcid.orcid')}
                      linkText={orcidLink}
                      externalLink={orcidLink}
                    />
                  );
                })}
              </Card>
            </StyledUserInfo>
            <StyledWrapper>
              <PublicProfilePublications arpId={arpId} />
            </StyledWrapper>
          </>
        )
      )}
    </>
  );
};

interface PublicProfilePublicationsProps {
  arpId: string;
}

const PublicProfilePublications: FC<PublicProfilePublicationsProps> = ({ arpId }) => {
  // TODO: Fetch publications by arpId
  const publications: PublishedPublicationPreview[] = [];

  return <PublishedPublicationList publications={publications} />;
};

export default PublicProfile;
