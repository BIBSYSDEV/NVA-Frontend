import React, { FC } from 'react';
import { Link, Chip } from '@material-ui/core';
import styled from 'styled-components';
import { Publication } from '../../../types/publication.types';
import ContentPage from '../../../components/ContentPage';
import { useTranslation } from 'react-i18next';
import PublicPublicationAuthors from './PublicPublicationAuthors';
import PublicPublicationFile from './PublicPublicationFile';
import Card from '../../../components/Card';
import Heading from '../../../components/Heading';
import LabelContentRow from '../../../components/LabelContentRow';
import Label from '../../../components/Label';
import NormalText from '../../../components/NormalText';
import { licenses } from '../../../types/file.types';
import { getNpiDiscipline } from '../../../utils/npiDisciplines';
import { StyledNormalTextPreWrapped } from '../../../components/styled/Wrappers';
import { displayDate } from '../../../utils/date-helpers';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

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

const StyledNormalText = styled(StyledNormalTextPreWrapped)`
  grid-area: description;
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
  margin-right: 1rem;
`;

const StyledContainer = styled.div`
  display: flex;
`;

const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-left: 0.25rem;
`;

interface PublicPublicationContentProps {
  publication: Publication;
}

const PublicPublicationContent: FC<PublicPublicationContentProps> = ({ publication }) => {
  const { t } = useTranslation('publication');

  const {
    abstract,
    contributors,
    date,
    description,
    mainTitle,
    npiSubjectHeading,
    reference: { doi, publicationContext, publicationInstance },
    series,
    tags,
  } = publication.entityDescription;

  // Show only the license for the first file for now
  const currentLicense = publication.fileSet?.files[0]?.license ?? null;
  const selectedLicense = licenses.find((license) => license.identifier === currentLicense?.identifier);

  return (
    <ContentPage>
      <Heading>{mainTitle}</Heading>
      {contributors && <PublicPublicationAuthors contributors={contributors} />}
      <StyledContentWrapper>
        <StyledSidebar>
          {publication.fileSet &&
            publication.fileSet.files.map((file) => <PublicPublicationFile file={file} key={file.identifier} />)}
        </StyledSidebar>
        <StyledMainContent>
          {doi && (
            <LabelContentRow minimal label={`${t('publication.link_to_publication')}:`}>
              <Link href={doi} target="_blank" rel="noopener noreferrer">
                {doi}
              </Link>
            </LabelContentRow>
          )}
          {abstract && (
            <StyledTextContainer>
              <StyledLabel>{`${t('description.abstract')}:`}</StyledLabel>
              <StyledTextDescription>{abstract}</StyledTextDescription>
            </StyledTextContainer>
          )}
          {description && (
            <StyledTextContainer>
              <StyledLabel>{`${t('description.description')}:`}</StyledLabel>
              <StyledTextDescription>{description}</StyledTextDescription>
            </StyledTextContainer>
          )}
          {tags.length > 0 && (
            <LabelContentRow minimal multiple label={`${t('description.tags')}:`}>
              {tags.map((tag) => (
                <StyledTag key={tag}>
                  <Chip label={tag} />
                </StyledTag>
              ))}
            </LabelContentRow>
          )}
          {publicationContext && (
            <LabelContentRow minimal multiple label={`${t('references.journal')}:`}>
              <StyledContainer>
                <NormalText>{publicationContext.title}</NormalText>
                {publicationContext.url && (
                  <Link href={publicationContext.url} target="_blank" rel="noopener noreferrer">
                    <StyledOpenInNewIcon aria-label={publicationContext.url} />
                  </Link>
                )}
              </StyledContainer>
              {publicationContext.onlineIssn && `${t('references.issn')} ${publicationContext.onlineIssn}`}
            </LabelContentRow>
          )}
          {publicationInstance && (
            <LabelContentRow minimal label={`${t('common:details')}:`}>
              {publicationInstance.volume && `${t('references.volume')} ${publicationInstance.volume}`}
              {publicationInstance.issue && `, ${t('references.issue')} ${publicationInstance.issue}`}
              {publicationInstance.pages?.begin &&
                publicationInstance.pages?.end &&
                `, ${t('references.pages')} ${publicationInstance.pages.begin}-${publicationInstance.pages.end}`}
              {publicationInstance.articleNumber &&
                `, ${t('references.article_number')} ${publicationInstance.articleNumber}`}
            </LabelContentRow>
          )}
          {date?.year && (
            <LabelContentRow minimal label={`${t('description.date_published')}:`}>
              {displayDate(date)}
            </LabelContentRow>
          )}
          {npiSubjectHeading && (
            <LabelContentRow minimal label={`${t('description.npi_disciplines')}:`}>
              {getNpiDiscipline(npiSubjectHeading)?.name}
            </LabelContentRow>
          )}
          {selectedLicense && (
            <StyledLicenseCard>
              <StyledLicenseImage src={selectedLicense.image} alt={selectedLicense.identifier} />
              <StyledLicenseLabel>
                {selectedLicense.link ? (
                  <Link href={selectedLicense.link} target="_blank" rel="noopener noreferrer">
                    {selectedLicense.label}
                  </Link>
                ) : (
                  selectedLicense.label
                )}
              </StyledLicenseLabel>
              <StyledNormalText>{selectedLicense.description}</StyledNormalText>
            </StyledLicenseCard>
          )}
          {publication.project && (
            <LabelContentRow minimal label={`${t('description.project_association')}:`}>
              {publication.project.name}
            </LabelContentRow>
          )}
          {series && (
            <LabelContentRow minimal label={`${t('references.series')}:`}>
              {series.title}
            </LabelContentRow>
          )}
        </StyledMainContent>
      </StyledContentWrapper>
    </ContentPage>
  );
};

export default PublicPublicationContent;
