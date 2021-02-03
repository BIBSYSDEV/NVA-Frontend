import React from 'react';
import { Chip, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { emptyRegistration, Registration } from '../../types/registration.types';
import { useTranslation } from 'react-i18next';
import PublicRegistrationAuthors from './PublicRegistrationAuthors';
import PublicRegistrationFile from './PublicRegistrationFile';
import LabelContentRow from '../../components/LabelContentRow';
import { getNpiDiscipline } from '../../utils/npiDisciplines';
import { displayDate } from '../../utils/date-helpers';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../types/publication_types/journalRegistration.types';
import { PublicRegistrationStatusBar } from './PublicRegistrationStatusBar';
import { isJournal, isDegree, isReport, isBook, isChapter } from '../../utils/registration-helpers';
import {
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceReport,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceChapter,
} from './PublicPublicationInstance';
import {
  PublicPublicationContextJournal,
  PublicPublicationContextDegree,
  PublicPublicationContextReport,
  PublicPublicationContextBook,
  PublicPublicationContextChapter,
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
import {
  ChapterPublicationContext,
  ChapterPublicationInstance,
} from '../../types/publication_types/chapterRegistration.types';
import { RegistrationPageHeader } from '../../components/PageHeader';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';

const StyledTag = styled.div`
  display: inline;
  margin-right: 1rem;
`;

export interface PublicRegistrationContentProps {
  registration: Registration;
  refetchRegistration: () => void;
}

const PublicRegistrationContent = ({ registration, refetchRegistration }: PublicRegistrationContentProps) => {
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

  return (
    <div>
      <PublicRegistrationStatusBar registration={registration} refetchRegistration={refetchRegistration} />
      <RegistrationPageHeader>{mainTitle || `[${t('common:missing_title')}]`}</RegistrationPageHeader>
      {contributors && <PublicRegistrationAuthors contributors={contributors} />}

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
        <PublicDoi registration={registration} />

        {description && (
          <LabelContentRow minimal label={`${t('description.description')}:`}>
            {description}
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
            <PublicPublicationContextBook publicationContext={reference.publicationContext as BookPublicationContext} />
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
        ) : isChapter(registration) ? (
          <>
            <PublicPublicationContextChapter
              publicationContext={reference.publicationContext as ChapterPublicationContext}
            />
            <PublicPublicationInstanceChapter
              publicationInstance={reference.publicationInstance as ChapterPublicationInstance}
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
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        {registration.fileSet?.files.map(
          (file) => !file.administrativeAgreement && <PublicRegistrationFile file={file} key={file.identifier} />
        )}
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        {abstract && (
          <LabelContentRow minimal label={`${t('description.abstract')}:`}>
            {abstract}
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
      </BackgroundDiv>

      <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
        {registration.projects.length > 0 && (
          <LabelContentRow minimal label={`${t('description.project_association')}:`}>
            {registration.projects.map((project) => (
              <Typography key={project.id}>{project.name}</Typography>
            ))}
          </LabelContentRow>
        )}
      </BackgroundDiv>
    </div>
  );
};

export default PublicRegistrationContent;
