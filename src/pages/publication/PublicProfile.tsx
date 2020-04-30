import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/actions/notificationActions';
import { PublishedPublicationPreview, PublicationStatus } from '../../types/publication.types';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { getMyPublications } from '../../api/publicationApi';
import PublishedPublicationList from './PublishedPublicationList';
import Card from '../../components/Card';
import { useTranslation } from 'react-i18next';
import { RootStore } from '../../redux/reducers/rootReducer';
import NormalText from '../../components/NormalText';
import { ORCID_BASE_URL } from '../../utils/constants';
import LabelTextLine from './../../components/LabelTextLine';
import Heading from '../../components/Heading';
import { NotificationVariant } from '../../types/notification.types';

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
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<PublishedPublicationPreview[]>([]);
  const { t } = useTranslation();
  const user = useSelector((store: RootStore) => store.user);

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

  return (
    <>
      <StyledUserInfo>
        <Card>
          <Heading>{user.name}</Heading>
          <LabelTextLine dataTestId="profile-email" label={t('common:email')} text={user.email} />
          {user.authority?.orcids.map((orcid: string) => {
            const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
            return (
              <LabelTextLine
                key={orcid}
                dataTestId={'orcid-info'}
                label={t('profile:orcid.orcid')}
                text={orcidLink}
                externalLink={orcidLink}
              />
            );
          })}
          {user.authority?.orgunitids.map((orgunitid) => (
            <NormalText key={orgunitid}>{orgunitid}</NormalText>
          ))}
        </Card>
      </StyledUserInfo>
      <StyledWrapper>
        {isLoading ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          <PublishedPublicationList publications={publishedPublications} />
        )}
      </StyledWrapper>
    </>
  );
};

export default PublicProfile;
