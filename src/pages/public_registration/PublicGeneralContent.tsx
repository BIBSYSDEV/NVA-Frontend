import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
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
  PublicLinkedContextContent,
  PublicJournalContent,
  PublicPublisherContent,
  PublicSeriesContent,
} from './PublicPublicationContext';
import {
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceReport,
  PublicPublicationInstanceChapter,
  PublicIsbnContent,
} from './PublicPublicationInstance';
import styled from 'styled-components';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
import RegistrationSummary from './RegistrationSummary';
import { JournalType } from '../../types/publicationFieldNames';
import { BookRegistration, ReportRegistration } from '../../types/registration.types';

const StyledContent = styled.div`
  display: grid;
  grid-template-areas: 'group0 group1';
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-areas: 'group0' 'group1';
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const StyledGroup0 = styled.div`
  grid-area: group0;
`;

const StyledGroup1 = styled.div`
  grid-area: group1;
`;

const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const {
    date,
    npiSubjectHeading,
    language,
    reference: { publicationContext, publicationInstance },
  } = registration.entityDescription;

  return (
    <StyledContent>
      <StyledGroup0>
        <Typography variant="h4" component="h2">
          {t(`publicationTypes:${publicationInstance.type}`)}
        </Typography>
        <Typography>{displayDate(date)}</Typography>

        <PublicDoi registration={registration} />

        {language && (
          <Typography>
            {t('description.primary_language')}:{' '}
            {t(
              `languages:${
                registrationLanguages.find((registrationLanguage) => registrationLanguage.value === language)?.id ??
                LanguageCodes.Undefined
              }`
            )}
          </Typography>
        )}
        {npiSubjectHeading && (
          <Typography>
            {t('description.npi_disciplines')}: {getNpiDiscipline(npiSubjectHeading)?.name}
          </Typography>
        )}

        {isJournal(registration) ? (
          <PublicPublicationInstanceJournal publicationInstance={publicationInstance as JournalPublicationInstance} />
        ) : isBook(registration) ? (
          <>
            <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as BookRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isDegree(registration) ? (
          <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
        ) : isReport(registration) ? (
          <>
            <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as ReportRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isChapter(registration) ? (
          <PublicPublicationInstanceChapter publicationInstance={publicationInstance as ChapterPublicationInstance} />
        ) : null}
      </StyledGroup0>

      <StyledGroup1>
        {isJournal(registration) ? (
          <>
            {publicationInstance.type === JournalType.CORRIGENDUM && (
              <>
                <Typography variant="h3">{t('resource_type.original_article')}</Typography>
                <RegistrationSummary id={(publicationInstance as JournalPublicationInstance).corrigendumFor} />
              </>
            )}
            <PublicJournalContent publicationContext={publicationContext as JournalPublicationContext} />
          </>
        ) : isBook(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as BookPublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as BookPublicationContext).seriesTitle} />
          </>
        ) : isDegree(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as DegreePublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as DegreePublicationContext).seriesTitle} />
          </>
        ) : isReport(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as ReportPublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as ReportPublicationContext).seriesTitle} />
          </>
        ) : isChapter(registration) ? (
          <PublicLinkedContextContent publicationContext={publicationContext as ChapterPublicationContext} />
        ) : null}
      </StyledGroup1>
    </StyledContent>
  );
};

export default PublicGeneralContent;
