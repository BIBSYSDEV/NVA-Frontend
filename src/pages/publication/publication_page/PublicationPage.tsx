import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../../api/publicationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { useDispatch } from 'react-redux';
import { CircularProgress, Link } from '@material-ui/core';
import { Publication, emptyPublication } from '../../../types/publication.types';
import styled from 'styled-components';
import ContentPage from '../../../components/ContentPage';
import { useTranslation } from 'react-i18next';
import PublicationPageAuthors from './PublicationPageAuthors';
import PublicationPageFiles from './PublicationPageFiles';
import NotFound from '../../errorpages/NotFound';
import Card from '../../../components/Card';
import Heading from '../../../components/Heading';
import { NotificationVariant } from '../../../types/notification.types';
import { useParams } from 'react-router';
import { DOI_PREFIX } from '../../../utils/constants';
import LabelContentRow from '../../../components/LabelContentRow';

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

  const {
    mainTitle,
    abstract,
    description,
    tags,
    date,
    contributors,
    reference: { doi, publicationContext },
    series,
  } = publication ? publication.entityDescription : emptyPublication.entityDescription;

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
                      <PublicationPageFiles files={publication.fileSet.files} />
                    </StyledSidebarCard>
                  )}
                  <StyledSidebarCard>
                    <LabelContentRow minimal label={t('description.date_published')}>
                      {date.year}
                      {date.month && `-${date.month}`}
                      {date.day && `-${date.day}`}
                    </LabelContentRow>
                  </StyledSidebarCard>
                </StyledSidebar>
                <StyledMainContent>
                  {doi && (
                    <LabelContentRow minimal label={t('publication.link_to_publication')}>
                      <Link href={`${DOI_PREFIX}${doi}`}>{`${DOI_PREFIX}${doi}`}</Link>
                    </LabelContentRow>
                  )}
                  {abstract && (
                    <LabelContentRow minimal label={t('description.abstract')}>
                      {abstract}
                    </LabelContentRow>
                  )}
                  {description && (
                    <LabelContentRow minimal label={t('description.description')}>
                      {description}
                    </LabelContentRow>
                  )}
                  {tags && (
                    <LabelContentRow minimal label={t('description.tags')}>
                      {tags}
                    </LabelContentRow>
                  )}
                  {publicationContext && (
                    <LabelContentRow minimal label={t('references.journal')}>
                      {publicationContext.title}
                    </LabelContentRow>
                  )}
                  {publication.project && (
                    <LabelContentRow minimal label={t('description.project_association')}>
                      {publication.project.name}
                    </LabelContentRow>
                  )}
                  {series && (
                    <LabelContentRow minimal label={t('references.series')}>
                      {series.title}
                    </LabelContentRow>
                  )}
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
