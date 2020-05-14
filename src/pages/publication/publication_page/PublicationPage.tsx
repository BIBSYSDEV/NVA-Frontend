import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../../api/publicationApi';
import { setNotification } from '../../../redux/actions/notificationActions';
import { useDispatch } from 'react-redux';
import { CircularProgress, Link, Chip } from '@material-ui/core';
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
import Label from '../../../components/Label';
import NormalText from '../../../components/NormalText';
import { licenses } from '../../../types/file.types';

const StyledContentWrapper = styled.div`
  display: flex;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    flex-direction: column;
  }
`;

const StyledSidebar = styled.div`
  min-width: 15rem;
  padding: 1rem 0;
`;

const StyledMainContent = styled.div`
  flex: 1;
  padding: 1rem 2rem;
`;

const StyledSidebarCard = styled(Card)`
  padding: 1rem 0.5rem;
`;

const StyledLicenseCard = styled(Card)`
  display: grid;
  grid-template-areas: 'image label' 'image description';
  column-gap: 1rem;
  align-items: center;
  justify-content: left;
  margin: 0.5rem 0;
  padding: 1rem;
`;

const StyledLicenseImage = styled.img`
  grid-area: image;
`;

const StyledLicenseLabel = styled(Label)`
  grid-area: label;
`;

const StyledNormalText = styled(NormalText)`
  grid-area: description;
  white-space: pre-wrap;
`;

const StyledTextContainer = styled.div`
  display: inline-block;
  margin: 1rem 0;
`;

const StyledLabel = styled(Label)`
  display: inline-block;
`;

const StyledTextDescription = styled(NormalText)`
  display: inline;
  margin-left: 1rem;
`;

const StyledTag = styled.div`
  display: inline;
  margin-left: 1rem;
`;

const StyledTagContainer = styled.div`
  align-items: center;
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

  // Show only the license for the first file for now
  const currentLicense = publication?.fileSet?.files[0]?.license ?? null;
  const selectedLicense = licenses.find((license) => license.identifier === currentLicense?.identifier);

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
                    <StyledTextContainer>
                      <StyledLabel>{t('description.abstract')}</StyledLabel>
                      <StyledTextDescription>{abstract}</StyledTextDescription>
                    </StyledTextContainer>
                  )}
                  {description && (
                    <StyledTextContainer>
                      <StyledLabel>{t('description.description')}</StyledLabel>
                      <StyledTextDescription>{description}</StyledTextDescription>
                    </StyledTextContainer>
                  )}
                  {tags && (
                    <StyledTagContainer>
                      <StyledLabel>{t('description.tags')}</StyledLabel>
                      {tags.map((tag) => (
                        <StyledTag key={tag}>
                          <Chip label={tag} />{' '}
                        </StyledTag>
                      ))}
                    </StyledTagContainer>
                  )}
                  {publicationContext && (
                    <LabelContentRow minimal label={t('references.journal')}>
                      {publicationContext.title}
                    </LabelContentRow>
                  )}
                  {selectedLicense && (
                    <StyledLicenseCard>
                      <StyledLicenseImage src={selectedLicense.image} alt={selectedLicense.identifier} />
                      <StyledLicenseLabel>{selectedLicense.label}</StyledLicenseLabel>
                      <StyledNormalText>{selectedLicense.description}</StyledNormalText>
                    </StyledLicenseCard>
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
