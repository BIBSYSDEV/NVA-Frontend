import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../redux/actions/notificationActions';
import { PublishedPublicationPreview } from '../../types/publication.types';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { getMyPublications } from '../../api/publicationApi';
import PublishedPublicationList from './PublishedPublicationList';
import i18n from '../../translations/i18n';
import UserCard from './../user/UserCard';
import { useTranslation } from 'react-i18next';
import { RootStore } from '../../redux/reducers/rootReducer';
import NormalText from '../../components/NormalText';
import { ORCID_BASE_URL } from '../../utils/constants';
import orcidIcon from '../../resources/images/orcid_logo.svg';

const StyledWrapper = styled.div`
  text-align: center;
`;

const StyledSecondaryUserInfo = styled.div`
  display: flex;
  background-color: ${props => props.theme.palette.background.default};
  align-content: flex-start;
  width: 100%;
  padding: 0.5rem;
`;

const StyledIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  padding-bottom: 0.5rem;
`;

const StyledOrcid = styled(NormalText)`
  display: flex;
  align-items: center;
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
        dispatch(addNotification(i18n.t('feedback:error.get_publications'), 'error'));
      } else {
        setPublications(publications);
      }
      setIsLoading(false);
    };
    loadData();
  }, [dispatch]);

  return (
    <>
      <StyledSecondaryUserInfo>
        <UserCard headingLabel={t('common:picture')} />
        <UserCard headingLabel="">
          <NormalText>{user.name}</NormalText>
          <NormalText>{user.email}</NormalText>
          {user.authority?.orcids.map((orcid: string) => {
            const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
            return (
              <StyledOrcid>
                <StyledIcon src={orcidIcon} alt="ORCID icon" />
                {orcidLink}
              </StyledOrcid>
            );
          })}
          {user.authority?.orgunitids.map(orgunitid => (
            <NormalText>{orgunitid}</NormalText>
          ))}
        </UserCard>
      </StyledSecondaryUserInfo>
      <StyledWrapper>
        {isLoading ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          <PublishedPublicationList publications={publications} />
        )}
      </StyledWrapper>
    </>
  );
};

export default PublicProfile;
