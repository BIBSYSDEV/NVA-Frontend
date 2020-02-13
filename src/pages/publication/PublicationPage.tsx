import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress, Link } from '@material-ui/core';
import { emptyPublication, Publication } from '../../types/publication.types';
import styled from 'styled-components';
import ContentPage from '../../components/FormCard/ContentPage';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import FormCard from '../../components/FormCard/FormCard';
import DescriptionIcon from '@material-ui/icons/DescriptionOutlined';
import { useTranslation } from 'react-i18next';
import LabelContentRowForPublicationPage from '../../components/LabelContentRowForPublicationPage';
import NormalText from '../../components/NormalText';
import PublicationPageAuthors from './PublicationPageAuthors';

const ContentWrapper = styled.div`
  display: flex;
  padding-top: 1rem;

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  min-width: 15rem;
`;

const MainContent = styled.div`
  flex: 1;
  padding-left: 1rem;
  min-width: 30rem;
`;

const StyledFileIcon = styled(DescriptionIcon)`
  width: 100px;
  height: 150px;
  border: 1px solid black;
  padding: 0.5rem;
`;

const FileIconWrapper = styled.div`
  text-align: center;
`;

const StyledSidebarCard = styled(FormCard)`
  padding: 0.5rem;
`;

interface PublicationPageProps {
  publicationId: string;
}

const PublicationPage: FC<PublicationPageProps> = ({ publicationId }) => {
  const dispatch = useDispatch();
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [publication, setPublication] = useState<Publication>(emptyPublication);
  const { t } = useTranslation('publication');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPublication(true);
      const publication = await getPublication(publicationId);
      if (publication?.error) {
        dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
      } else {
        console.log(publication);
        setPublication(publication);
      }
      setIsLoadingPublication(false);
    };
    loadData();
  }, [dispatch, publicationId]);

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        <ContentPage>
          <FormCardHeading>{publication.title?.no}</FormCardHeading>
          <PublicationPageAuthors authors={publication.authors} />
          <ContentWrapper>
            <Sidebar>
              <StyledSidebarCard>
                <NormalText>NTNU institutt for osteloff</NormalText>
                <NormalText>SINTEF Teknologi og samfunn</NormalText>
              </StyledSidebarCard>
              <StyledSidebarCard>
                <FileIconWrapper>
                  <StyledFileIcon />
                </FileIconWrapper>
              </StyledSidebarCard>
              <StyledSidebarCard>
                <LabelContentRowForPublicationPage label={t('description.date_published')}>
                  {publication.publicationDate.year}
                </LabelContentRowForPublicationPage>
              </StyledSidebarCard>
            </Sidebar>
            <MainContent>
              <LabelContentRowForPublicationPage label={t('references.doi')}>
                <Link href={publication.doiLink}>{publication.doiLink}</Link>
              </LabelContentRowForPublicationPage>
              <LabelContentRowForPublicationPage label={t('description.abstract')}>
                {publication.abstract}
              </LabelContentRowForPublicationPage>
              <LabelContentRowForPublicationPage label={t('description.description')}>
                {publication.description}
              </LabelContentRowForPublicationPage>
              <LabelContentRowForPublicationPage label={t('description.tags')}>
                {publication.tags}
              </LabelContentRowForPublicationPage>
            </MainContent>
          </ContentWrapper>
        </ContentPage>
      )}
    </>
  );
};

export default PublicationPage;
