import React, { FC } from 'react';
import { Link, Chip, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { emptyRegistration, Registration } from '../../types/registration.types';
import ContentPage from '../../components/ContentPage';
import { useTranslation } from 'react-i18next';
import PublicRegistrationAuthors from './PublicRegistrationAuthors';
import PublicRegistrationFile from './PublicRegistrationFile';
import Card from '../../components/Card';
import Heading from '../../components/Heading';
import LabelContentRow from '../../components/LabelContentRow';
import Label from '../../components/Label';
import { licenses } from '../../types/file.types';
import { getNpiDiscipline } from '../../utils/npiDisciplines';
import { StyledNormalTextPreWrapped } from '../../components/styled/Wrappers';
import { displayDate } from '../../utils/date-helpers';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../types/publication_types/journalRegistration.types';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { isJournal, isDegree, isReport, isBook } from '../../utils/registration-helpers';
import {
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceReport,
  PublicPublicationInstanceBook,
} from './PublicPublicationInstance';
import {
  PublicPublicationContextJournal,
  PublicPublicationContextDegree,
  PublicPublicationContextReport,
  PublicPublicationContextBook,
} from './PublicPublicationContext';
import {
  DegreePublicationContext,
  DegreePublicationInstance,
} from '../../types/publication_types/degreeRegistration.types';
import {
  ReportPublicationContext,
  ReportPublicationInstance,
} from '../../types/publication_types/reportRegistration.types';
import PublicDoi from './PublicDoi';
import deepmerge from 'deepmerge';
import { BookPublicationContext, BookPublicationInstance } from '../../types/publication_types/bookRegistration.types';

const StyledContentWrapper = styled.div`
  display: flex;
  padding-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    flex-direction: column;
  }
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

const StyledTag = styled.div`
  display: inline;
  margin-right: 1rem;
`;

export interface PublicRegistrationContentProps {
  registration: Registration;
  refetchRegistration: () => void;
}

const PublicRegistrationContent: FC<PublicRegistrationContentProps> = ({ registration, refetchRegistration }) => {
  const { t } = useTranslation('registration');

  // Registration can lack some fields if it's newly created
  registration = deepmerge(emptyRegistration, registration);

  const {
    abstract,
    contributors,
    date,
    description,
    mainTitle,
    npiSubjectHeading,
    reference,
    tags = [],
  } = registration.entityDescription;

  // Show only the license for the first file for now
  const currentLicense = registration.fileSet?.files[0]?.license ?? null;
  const selectedLicense = licenses.find((license) => license.identifier === currentLicense?.identifier);

  return (
    <ContentPage>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <Heading>{mainTitle}</Heading>
      {contributors && <PublicRegistrationAuthors contributors={contributors} />}
      <StyledContentWrapper>
        {registration.fileSet?.files.map(
          (file) => !file.administrativeAgreement && <PublicRegistrationFile file={file} key={file.identifier} />
        )}
        <StyledMainContent>
          <PublicDoi registration={registration} />

          {abstract && (
            <LabelContentRow minimal label={`${t('description.abstract')}:`}>
              {abstract}
            </LabelContentRow>
          )}
          {description && (
            <LabelContentRow minimal label={`${t('description.description')}:`}>
              {description}
            </LabelContentRow>
          )}
          {tags.length > 0 && (
            <LabelContentRow minimal multiple label={`${t('description.keywords')}:`}>
              {tags.map((tag) => (
                <StyledTag key={tag}>
                  <Chip label={tag} />
                </StyledTag>
              ))}
            </LabelContentRow>
          )}

          {isJournal(registration) ? (
            <>
              <PublicPublicationContextJournal
                publicationContext={reference.publicationContext as JournalPublicationContext}
              />
              <PublicPublicationInstanceJournal
                publicationInstance={reference.publicationInstance as JournalPublicationInstance}
              />
            </>
          ) : isBook(registration) ? (
            <>
              <PublicPublicationContextBook
                publicationContext={reference.publicationContext as BookPublicationContext}
              />
              <PublicPublicationInstanceBook
                publicationInstance={reference.publicationInstance as BookPublicationInstance}
              />
            </>
          ) : isDegree(registration) ? (
            <>
              <PublicPublicationContextDegree
                publicationContext={reference.publicationContext as DegreePublicationContext}
              />
              <PublicPublicationInstanceDegree
                publicationInstance={reference.publicationInstance as DegreePublicationInstance}
              />
            </>
          ) : isReport(registration) ? (
            <>
              <PublicPublicationContextReport
                publicationContext={reference.publicationContext as ReportPublicationContext}
              />
              <PublicPublicationInstanceReport
                publicationInstance={reference.publicationInstance as ReportPublicationInstance}
              />
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
          {registration.projects.length > 0 && (
            <LabelContentRow minimal label={`${t('description.project_association')}:`}>
              {registration.projects.map((project) => (
                <Typography key={project.id}>{project.name}</Typography>
              ))}
            </LabelContentRow>
          )}
        </StyledMainContent>
      </StyledContentWrapper>
    </ContentPage>
  );
};

export default PublicRegistrationContent;
