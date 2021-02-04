import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import LabelContentRow from '../../components/LabelContentRow';
import { BookPublicationContext, BookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import {
  ChapterPublicationContext,
  ChapterPublicationInstance,
} from '../../types/publication_types/chapterRegistration.types';
import {
  DegreePublicationContext,
  DegreePublicationInstance,
} from '../../types/publication_types/degreeRegistration.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../types/publication_types/journalRegistration.types';
import {
  ReportPublicationContext,
  ReportPublicationInstance,
} from '../../types/publication_types/reportRegistration.types';
import { displayDate } from '../../utils/date-helpers';
import { getNpiDiscipline } from '../../utils/npiDisciplines';
import { isJournal, isBook, isDegree, isReport, isChapter } from '../../utils/registration-helpers';
import PublicDoi from './PublicDoi';
import {
  PublicPublicationContextJournal,
  PublicPublicationContextBook,
  PublicPublicationContextDegree,
  PublicPublicationContextReport,
  PublicPublicationContextChapter,
} from './PublicPublicationContext';
import {
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceReport,
  PublicPublicationInstanceChapter,
} from './PublicPublicationInstance';

const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const {
    date,
    description,
    npiSubjectHeading,
    reference: { publicationContext, publicationInstance },
  } = registration.entityDescription;

  return (
    <>
      <Typography variant="h4" component="h2">
        {t(`publicationTypes:${publicationInstance.type}`)}
      </Typography>
      <Typography>{displayDate(date)}</Typography>

      <PublicDoi registration={registration} />

      {description && (
        <LabelContentRow minimal label={`${t('description.description')}:`}>
          {description}
        </LabelContentRow>
      )}
      {isJournal(registration) ? (
        <>
          <PublicPublicationContextJournal publicationContext={publicationContext as JournalPublicationContext} />
          <PublicPublicationInstanceJournal publicationInstance={publicationInstance as JournalPublicationInstance} />
        </>
      ) : isBook(registration) ? (
        <>
          <PublicPublicationContextBook publicationContext={publicationContext as BookPublicationContext} />
          <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
        </>
      ) : isDegree(registration) ? (
        <>
          <PublicPublicationContextDegree publicationContext={publicationContext as DegreePublicationContext} />
          <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
        </>
      ) : isReport(registration) ? (
        <>
          <PublicPublicationContextReport publicationContext={publicationContext as ReportPublicationContext} />
          <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
        </>
      ) : isChapter(registration) ? (
        <>
          <PublicPublicationContextChapter publicationContext={publicationContext as ChapterPublicationContext} />
          <PublicPublicationInstanceChapter publicationInstance={publicationInstance as ChapterPublicationInstance} />
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
    </>
  );
};

export default PublicGeneralContent;
