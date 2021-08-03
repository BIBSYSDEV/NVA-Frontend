import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { PublicDoi } from './PublicDoi';
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
import { RegistrationSummary } from './RegistrationSummary';
import { StyledGeneralInfo } from '../../components/landing_page/SyledGeneralInfo';

export const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const {
    date,
    npiSubjectHeading,
    language,
    reference: { publicationContext, publicationInstance },
  } = registration.entityDescription;

  const journalPublicationInstance = publicationInstance as JournalPublicationInstance;
  const { content, peerReviewed } = journalPublicationInstance;

  return (
    <StyledGeneralInfo>
      <div>
        <Typography variant="overline">{t('public_page.about_registration')}</Typography>

        {content && <Typography>{t(`resource_type.journal_content_types.${content}`)}</Typography>}

        {peerReviewed && <Typography>{t('resource_type.peer_reviewed')}</Typography>}

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
      </div>

      <div>
        {isJournal(registration) ? (
          <>
            <PublicJournalContent date={date} publicationContext={publicationContext as JournalPublicationContext} />
            <PublicPublicationInstanceJournal publicationInstance={journalPublicationInstance} />
            {publicationInstance.type === JournalType.CORRIGENDUM && (
              <>
                <Typography variant="overline" component="p">
                  {t('resource_type.original_article')}
                </Typography>
                <RegistrationSummary id={journalPublicationInstance.corrigendumFor} />
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
      </div>
    </StyledGeneralInfo>
  );
};
