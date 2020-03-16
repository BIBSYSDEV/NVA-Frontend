import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { setNotification } from '../../redux/actions/notificationActions';
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
import PublicationPageSeries from './publication_page/PublicationPageSeries';
import NotFound from '../errorpages/NotFound';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import { NotificationVariant } from '../../types/notification.types';
import { useParams } from 'react-router';

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

const PublicationPage: FC = () => {
  const { identifier } = useParams();
  const dispatch = useDispatch();
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [publication, setPublication] = useState<Publication>();
  const { t } = useTranslation('publication');

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPublication(true);
      const publication = await getPublication(identifier!);
      if (publication?.error) {
        dispatch(setNotification(publication.error, NotificationVariant.Error));
      } else {
        setPublication(publication);
      }
      setIsLoadingPublication(false);
    };
    if (identifier) {
      loadData();
    }
  }, [dispatch, identifier]);

  const { mainTitle, abstract, description, tags, date, projects, contributors } = publication
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
                  {/* <StyledSidebarCard>
                    TODO: Put affiliations to contributors here
                  </StyledSidebarCard> */}
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
                  </StyledSidebarCard>
                </StyledSidebar>
                <StyledMainContent>
                  {publication.doiLink && (
                    <LabelContentRowForPublicationPage label={t('references.doi')}>
                      <Link href={publication.doiLink}>{publication.doiLink}</Link>
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
                  {projects?.length > 0 && (
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
