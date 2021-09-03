import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
import {
  BookPublicationContext,
  BookPublicationInstance,
  BookRegistration,
} from '../../types/publication_types/bookRegistration.types';
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
  ReportRegistration,
} from '../../types/publication_types/reportRegistration.types';
import { DegreeType, JournalType } from '../../types/publicationFieldNames';
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
import { dataTestId } from '../../utils/dataTestIds';

export const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const {
    date,
    npiSubjectHeading,
    language,
    reference: { publicationContext, publicationInstance },
  } = registration.entityDescription;

  const journalPublicationInstance = publicationInstance as JournalPublicationInstance;
  const { contentType, peerReviewed, corrigendumFor } = journalPublicationInstance;

  return (
    <StyledGeneralInfo>
      <div>
        <Typography variant="overline">{t('public_page.about_registration')}</Typography>

        {contentType && <Typography>{t(`resource_type.content_types.${contentType}`)}</Typography>}

        {peerReviewed && <Typography>{t('resource_type.peer_reviewed')}</Typography>}

        {language && (
          <Typography data-testid={dataTestId.registrationLandingPage.primaryLanguage}>
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
          <Typography data-testid={dataTestId.registrationLandingPage.npi}>
            {t('description.npi_disciplines')}: {getNpiDiscipline(npiSubjectHeading)?.name}
          </Typography>
        )}

        <PublicDoi registration={registration} />
      </div>

      <div data-testid={dataTestId.registrationLandingPage.subtypeFields}>
        {isJournal(registration) ? (
          <>
            <PublicJournalContent date={date} publicationContext={publicationContext as JournalPublicationContext} />
            <PublicPublicationInstanceJournal publicationInstance={journalPublicationInstance} />
            {publicationInstance.type === JournalType.Corrigendum && (
              <>
                <Typography variant="overline" component="p">
                  {t('resource_type.original_article')}
                </Typography>
                <RegistrationSummary id={corrigendumFor} />
              </>
            )}
          </>
        ) : isBook(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as BookPublicationContext} />
            <PublicSeriesContent publicationContext={publicationContext as BookPublicationContext} />
            <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as BookRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isDegree(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as DegreePublicationContext} />
            {publicationInstance.type === DegreeType.Phd && (
              <PublicSeriesContent publicationContext={publicationContext as DegreePublicationContext} />
            )}
            <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
          </>
        ) : isReport(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as ReportPublicationContext} />
            <PublicSeriesContent publicationContext={publicationContext as DegreePublicationContext} />
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
