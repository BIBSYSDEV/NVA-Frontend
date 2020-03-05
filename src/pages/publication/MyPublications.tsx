import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import PublicationList from './PublicationList';
import { getMyPublications } from '../../api/publicationApi';
import { setNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { PublicationPreview } from '../../types/publication.types';
import { RootStore } from '../../redux/reducers/rootReducer';
import { Link as RouterLink } from 'react-router-dom';
import { NotificationVariant } from '../../types/notification.types';

const StyledWrapper = styled.div`
  text-align: center;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const MyPublications: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<PublicationPreview[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const publications = await getMyPublications();
      if (publications?.error) {
        dispatch(setNotification(i18n.t('feedback:error.get_publications'), NotificationVariant.Error));
      } else {
        setPublications(publications);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  return (
    <Card>
      <Heading>{t('workLists:my_publications')}</Heading>
      <StyledButtonWrapper>
        <Button
          color="primary"
          component={RouterLink}
          to={`/public-profile/${user.name}`}
          data-testid="public-profile-button">
          {t('workLists:go_to_public_profile')}
        </Button>
      </StyledButtonWrapper>
      <StyledWrapper>
        {isLoading ? <CircularProgress color="inherit" size={20} /> : <PublicationList publications={publications} />}
      </StyledWrapper>
    </Card>
  );
};

export default MyPublications;
