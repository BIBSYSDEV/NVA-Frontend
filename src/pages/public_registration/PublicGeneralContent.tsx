import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
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
import { DegreeType, JournalType } from '../../types/publicationFieldNames';
import { BookRegistration, ReportRegistration } from '../../types/registration.types';
import { getNpiDiscipline } from '../../utils/npiDisciplines';
import { isBook, isChapter, isDegree, isJournal, isReport } from '../../utils/registration-helpers';
import PublicDoi from './PublicDoi';
import {
  PublicJournalContent,
  PublicLinkedContextContent,
  PublicPublisherContent,
  PublicSeriesContent,
} from './PublicPublicationContext';
import {
  PublicIsbnContent,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceChapter,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceReport,
} from './PublicPublicationInstance';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import RegistrationSummary from './RegistrationSummary';

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
        <Typography variant="overline">{t('public_page.about_registration')}</Typography>

        {(publicationInstance as JournalPublicationInstance).peerReviewed && (
          <Typography>{t('resource_type.peer_reviewed')}</Typography>
        )}

        {language && (
          <Typography>
            {t('common:language')}:{' '}
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

        <PublicDoi registration={registration} />
      </StyledGroup0>

      <StyledGroup1>
        {isJournal(registration) ? (
          <>
            <PublicJournalContent date={date} publicationContext={publicationContext as JournalPublicationContext} />
            <PublicPublicationInstanceJournal publicationInstance={publicationInstance as JournalPublicationInstance} />
            {publicationInstance.type === JournalType.CORRIGENDUM && (
              <>
                <Typography variant="overline" component="p">
                  {t('resource_type.original_article')}
                </Typography>
                <RegistrationSummary id={(publicationInstance as JournalPublicationInstance).corrigendumFor} />
              </>
            )}
          </>
        ) : isBook(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as BookPublicationContext} />
            <PublicSeriesContent
              seriesTitle={(publicationContext as BookPublicationContext).seriesTitle}
              seriesNumber={(publicationContext as BookPublicationContext).seriesNumber}
            />
            <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as BookRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isDegree(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as DegreePublicationContext} />
            {publicationInstance.type === DegreeType.PHD && (
              <PublicSeriesContent
                seriesTitle={(publicationContext as DegreePublicationContext).seriesTitle}
                seriesNumber={(publicationContext as DegreePublicationContext).seriesNumber}
              />
            )}
            <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
          </>
        ) : isReport(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as ReportPublicationContext} />
            <PublicSeriesContent
              seriesTitle={(publicationContext as ReportPublicationContext).seriesTitle}
              seriesNumber={(publicationContext as ReportPublicationContext).seriesNumber}
            />
            <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as ReportRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isChapter(registration) ? (
          <>
            <PublicLinkedContextContent publicationContext={publicationContext as ChapterPublicationContext} />
            <PublicPublicationInstanceChapter publicationInstance={publicationInstance as ChapterPublicationInstance} />
          </>
        ) : null}
      </StyledGroup1>
    </StyledContent>
  );
};

export default PublicGeneralContent;
