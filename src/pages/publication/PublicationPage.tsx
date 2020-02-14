import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress, Link } from '@material-ui/core';
import { emptyPublication, Publication } from '../../types/publication.types';
import styled from 'styled-components';
import ContentPage from '../../components/ContentPage';
import FormCardHeading from '../../components/FormCard/FormCardHeading';
import FormCard from '../../components/FormCard/FormCard';
import { useTranslation } from 'react-i18next';
import LabelContentRowForPublicationPage from '../../components/LabelContentRowForPublicationPage';
import PublicationPageAuthors from './publication_page/PublicationPageAuthors';
import PublicationPageFiles from './publication_page/PublicationPageFiles';
import PublicationPageJournal from './publication_page/PublicationPageJournal';
import PublicationPageIdentifiers from './publication_page/PublicationPageIdentifiers';
import NormalText from '../../components/NormalText';
import PublicationPageSeries from './publication_page/PublicationPageSeries';
import NotFound from '../errorpages/NotFound';

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
          {publication?.id ? (
            <>
              <FormCardHeading>{publication.title?.no}</FormCardHeading>
              {publication.authors && <PublicationPageAuthors authors={publication.authors} />}
              <ContentWrapper>
                <Sidebar>
                  <StyledSidebarCard>
                    <NormalText>NTNU institutt for osteloff</NormalText>
                    <NormalText>SINTEF Teknologi og samfunn</NormalText>
                  </StyledSidebarCard>
                  {publication.files && (
                    <StyledSidebarCard>
                      <PublicationPageFiles files={publication.files} />
                    </StyledSidebarCard>
                  )}
                  <StyledSidebarCard>
                    <LabelContentRowForPublicationPage label={t('description.date_published')}>
                      {publication.publicationDate.year}
                      {publication.publicationDate.month && `-${publication.publicationDate.month}`}
                      {publication.publicationDate.day && `-${publication.publicationDate.day}`}
                    </LabelContentRowForPublicationPage>
                    <PublicationPageIdentifiers publication={publication} />
                  </StyledSidebarCard>
                </Sidebar>
                <MainContent>
                  {publication.doiLink && (
                    <LabelContentRowForPublicationPage label={t('references.doi')}>
                      <Link href={publication.doiLink}>{publication.doiLink}</Link>
                    </LabelContentRowForPublicationPage>
                  )}
                  {publication.abstract && (
                    <LabelContentRowForPublicationPage label={t('description.abstract')}>
                      {publication.abstract}
                    </LabelContentRowForPublicationPage>
                  )}
                  {publication.description && (
                    <LabelContentRowForPublicationPage label={t('description.description')}>
                      {publication.description}
                    </LabelContentRowForPublicationPage>
                  )}
                  {publication.tags && (
                    <LabelContentRowForPublicationPage label={t('description.tags')}>
                      {publication.tags}
                    </LabelContentRowForPublicationPage>
                  )}
                  <PublicationPageJournal publication={publication} />
                  {publication.projects.length > 0 && (
                    <LabelContentRowForPublicationPage label={t('description.project_association')}>
                      {publication.projects?.[0].titles?.[0].title}
                    </LabelContentRowForPublicationPage>
                  )}
                  <PublicationPageSeries publication={publication} />
                </MainContent>
              </ContentWrapper>
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
