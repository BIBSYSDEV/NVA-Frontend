import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { setNotification } from '../../redux/actions/notificationActions';
import { PublishedPublicationPreview, PublicationStatus } from '../../types/publication.types';
import { getMyPublications } from '../../api/publicationApi';
import PublishedPublicationList from './PublishedPublicationList';
import Card from '../../components/Card';
import { ORCID_BASE_URL } from '../../utils/constants';
import LabelTextLine from './../../components/LabelTextLine';
import Heading from '../../components/Heading';
import { NotificationVariant } from '../../types/notification.types';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import useFetchAuthority from '../../utils/hooks/useFetchAuthority';

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
              <PublicProfilePublicationsProps arpId={arpId} />
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

// TODO: Fetch publications of given user
const PublicProfilePublicationsProps: FC<PublicProfilePublicationsProps> = ({ arpId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<PublishedPublicationPreview[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const publications = await getMyPublications();
      if (publications?.error) {
        dispatch(setNotification(t('feedback:error.get_publications'), NotificationVariant.Error));
      } else {
        setPublications(publications);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch, t]);

  const publishedPublications = publications.filter(
    (publication) => publication.status === PublicationStatus.PUBLISHED
  );

  return isLoading ? (
    <CircularProgress />
  ) : publications ? (
    <PublishedPublicationList publications={publishedPublications} />
  ) : null;
};

export default PublicProfile;
