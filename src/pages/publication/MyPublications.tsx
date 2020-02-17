import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StyledCard from '../../components/Card';
import Heading from '../../components/Heading';
import PublicationList from './PublicationList';
import { getMyPublications } from '../../api/publicationApi';
import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { PublicationPreview } from '../../types/publication.types';

export interface DummyPublicationListElement {
  id: string;
  title: string;
  createdDate: string;
  status: string;
}

const StyledWrapper = styled.div`
  text-align: center;
`;

const MyPublications: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<PublicationPreview[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const publications = await getMyPublications();
      if (publications?.error) {
        dispatch(addNotification(i18n.t('feedback:error.get_publications'), 'error'));
      } else {
        setPublications(publications);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  return (
    <StyledCard>
      <Heading>{t('workLists:my_publications')}</Heading>
      <StyledWrapper>
        {isLoading ? <CircularProgress color="inherit" size={20} /> : <PublicationList publications={publications} />}
      </StyledWrapper>
    </StyledCard>
  );
};

export default MyPublications;
