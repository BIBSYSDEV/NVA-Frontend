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
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../types/publication_types/journalPublication.types';
import { PublicPublicationStatusBar } from './PublicPublicationStatusBar';
import { isJournal, isDegree, isReport } from '../../../utils/publication-helpers';
import {
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceReport,
} from './PublicPublicationInstance';
import {
  PublicPublicationContextJournal,
  PublicPublicationContextDegree,
  PublicPublicationContextReport,
} from './PublicPublicationContext';
import {
  DegreePublicationContext,
  DegreePublicationInstance,
} from '../../../types/publication_types/degreePublication.types';
import {
  ReportPublicationContext,
  ReportPublicationInstance,
} from '../../../types/publication_types/reportPublication.types';

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

export interface PublicPublicationContentProps {
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
    tags,
  } = publication.entityDescription;

  // Show only the license for the first file for now
  const currentLicense = publication.fileSet?.files[0]?.license ?? null;
  const selectedLicense = licenses.find((license) => license.identifier === currentLicense?.identifier);

  return (
    <ContentPage>
      <PublicPublicationStatusBar publication={publication} />
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

          {isJournal(publication) ? (
            <>
              <PublicPublicationContextJournal publicationContext={publicationContext as JournalPublicationContext} />
              <PublicPublicationInstanceJournal
                publicationInstance={publicationInstance as JournalPublicationInstance}
              />
            </>
          ) : isDegree(publication) ? (
            <>
              <PublicPublicationContextDegree publicationContext={publicationContext as DegreePublicationContext} />
              <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
            </>
          ) : isReport(publication) ? (
            <>
              <PublicPublicationContextReport publicationContext={publicationContext as ReportPublicationContext} />
              <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
            </>
          ) : null}

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
        </StyledMainContent>
      </StyledContentWrapper>
    </ContentPage>
  );
};

export default PublicPublicationContent;
