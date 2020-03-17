import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { setNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress, Link } from '@material-ui/core';
import { Publication, emptyPublication } from '../../types/publication.types';
import styled from 'styled-components';
import ContentPage from '../../components/ContentPage';
import { useTranslation } from 'react-i18next';
import LabelContentRowForPublicationPage from './publication_page/LabelContentRowForPublicationPage';
import PublicationPageAuthors from './publication_page/PublicationPageAuthors';
import PublicationPageFiles from './publication_page/PublicationPageFiles';
import PublicationPageJournal from './publication_page/PublicationPageJournal';
import NormalText from '../../components/NormalText';
import PublicationPageSeries from './publication_page/PublicationPageSeries';
import NotFound from '../errorpages/NotFound';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { NotificationVariant } from '../../types/notification.types';

const StyledContentWrapper = styled.div`
  display: flex;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    flex-direction: column;
  }
`;

const StyledSidebar = styled.div`
  min-width: 15rem;
`;

const StyledMainContent = styled.div`
  flex: 1;
  padding-left: 1rem;
`;

const StyledSidebarCard = styled(Card)`
  padding: 0.5rem;
`;

interface PublicationPageProps {
  publicationId: string;
}

const PublicationPage: FC<PublicationPageProps> = ({ publicationId }) => {
  const dispatch = useDispatch();
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [publication, setPublication] = useState<Publication>();
  const { t } = useTranslation('publication');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPublication(true);
      const publication = await getPublication(publicationId);
      if (publication?.error) {
        dispatch(setNotification(i18n.t('feedback:error.get_publication'), NotificationVariant.Error));
      } else {
        setPublication(publication);
      }
      setIsLoadingPublication(false);
    };
    loadData();
  }, [dispatch, publicationId]);

  const { mainTitle, abstract, description, tags, date, projects, contributors, doiUrl } = publication
    ? publication.entityDescription
    : emptyPublication.entityDescription;

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        <ContentPage>
          {publication ? (
            <>
              <Heading>{mainTitle}</Heading>
              {contributors && <PublicationPageAuthors contributors={contributors} />}
              <StyledContentWrapper>
                <StyledSidebar>
                  <StyledSidebarCard>
                    <NormalText>NTNU institutt for osteloff</NormalText>
                    <NormalText>SINTEF Teknologi og samfunn</NormalText>
                  </StyledSidebarCard>
                  {publication.fileSet && (
                    <StyledSidebarCard>
                      <PublicationPageFiles files={publication.fileSet} />
                    </StyledSidebarCard>
                  )}
                  <StyledSidebarCard>
                    <LabelContentRowForPublicationPage label={t('description.date_published')}>
                      {date.year}
                      {date.month && `-${date.month}`}
                      {date.day && `-${date.day}`}
                    </LabelContentRowForPublicationPage>
                    <LabelContentRowForPublicationPage label={t('references.isbn')}>
                      {publication?.reference?.book?.isbn || publication?.reference?.report?.isbn}
                    </LabelContentRowForPublicationPage>
                  </StyledSidebarCard>
                </StyledSidebar>
                <StyledMainContent>
                  {doiUrl && (
                    <LabelContentRowForPublicationPage label={t('publication.link_to_publication')}>
                      <Link href={doiUrl}>{doiUrl}</Link>
                    </LabelContentRowForPublicationPage>
                  )}
                  {abstract && (
                    <LabelContentRowForPublicationPage label={t('description.abstract')}>
                      {abstract}
                    </LabelContentRowForPublicationPage>
                  )}
                  {description && (
                    <LabelContentRowForPublicationPage label={t('description.description')}>
                      {description}
                    </LabelContentRowForPublicationPage>
                  )}
                  {tags && (
                    <LabelContentRowForPublicationPage label={t('description.tags')}>
                      {tags}
                    </LabelContentRowForPublicationPage>
                  )}
                  <PublicationPageJournal publication={publication} />
                  {projects.length > 0 && (
                    <LabelContentRowForPublicationPage label={t('description.project_association')}>
                      {projects?.[0].titles?.[0].title}
                    </LabelContentRowForPublicationPage>
                  )}
                  <PublicationPageSeries publication={publication} />
                </StyledMainContent>
              </StyledContentWrapper>
            </>
          ) : (
            <NotFound />
          )}
        </ContentPage>
      )}
    </>
  );
};

export default PublicationPage;
