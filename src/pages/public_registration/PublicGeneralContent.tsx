import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
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
  DegreeRegistration,
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
import { isBook, isChapter, isDegree, isJournal, isReport } from '../../utils/registration-helpers';
import { PublicDoi } from './PublicDoi';
import { PublicJournal, PublicPartOfContent, PublicPublisher, PublicSeries } from './PublicPublicationContext';
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
import { displayDate } from '../../utils/date-helpers';

export const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const { entityDescription } = registration;

  const publicationContext = entityDescription?.reference?.publicationContext;
  const publicationInstance = entityDescription?.reference?.publicationInstance;
  const journalPublicationInstance = entityDescription?.reference?.publicationInstance as
    | JournalPublicationInstance
    | undefined;

  return (
    <StyledGeneralInfo>
      <div>
        <Typography variant="overline">{t('public_page.about_registration')}</Typography>

        <Typography>{displayDate(entityDescription?.date)}</Typography>

        {journalPublicationInstance?.contentType && (
          <Typography>{t(`resource_type.content_types.${journalPublicationInstance?.contentType}`)}</Typography>
        )}

        {journalPublicationInstance?.peerReviewed && <Typography>{t('resource_type.peer_reviewed')}</Typography>}

        {entityDescription?.language && (
          <Typography data-testid={dataTestId.registrationLandingPage.primaryLanguage}>
            {t('common:language')}:{' '}
            {t(
              `languages:${
                registrationLanguages.find(
                  (registrationLanguage) => registrationLanguage.value === entityDescription.language
                )?.id ?? LanguageCodes.Undefined
              }`
            )}
          </Typography>
        )}

        {entityDescription?.npiSubjectHeading && (
          <Typography data-testid={dataTestId.registrationLandingPage.npi}>
            {t('description.npi_disciplines')}: {t(`disciplines:${entityDescription.npiSubjectHeading}`)}
          </Typography>
        )}

        <PublicDoi registration={registration} />
      </div>

      <div data-testid={dataTestId.registrationLandingPage.subtypeFields}>
        {publicationInstance &&
          (isJournal(publicationInstance.type) && journalPublicationInstance ? (
            <>
              <PublicJournal publicationContext={publicationContext as JournalPublicationContext} />
              <PublicPublicationInstanceJournal publicationInstance={journalPublicationInstance} />
              {publicationInstance.type === JournalType.Corrigendum && (
                <>
                  <Typography variant="overline" component="p">
                    {t('resource_type.original_article')}
                  </Typography>
                  <RegistrationSummary id={journalPublicationInstance.corrigendumFor ?? ''} />
                </>
              )}
            </>
          ) : isBook(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as BookPublicationContext).publisher} />
              <PublicSeries publicationContext={publicationContext as BookPublicationContext} />
              <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
              <PublicIsbnContent
                isbnList={(registration as BookRegistration).entityDescription.reference?.publicationContext.isbnList}
              />
            </>
          ) : isDegree(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as DegreePublicationContext).publisher} />
              {publicationInstance.type === DegreeType.Phd && (
                <>
                  <PublicSeries publicationContext={publicationContext as DegreePublicationContext} />
                  <PublicIsbnContent
                    isbnList={
                      (registration as DegreeRegistration).entityDescription.reference?.publicationContext.isbnList
                    }
                  />
                </>
              )}
              <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
            </>
          ) : isReport(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as ReportPublicationContext).publisher} />
              <PublicSeries publicationContext={publicationContext as ReportPublicationContext} />
              <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
              <PublicIsbnContent
                isbnList={(registration as ReportRegistration).entityDescription.reference?.publicationContext.isbnList}
              />
            </>
          ) : isChapter(publicationInstance.type) ? (
            <>
              <PublicPartOfContent partOf={(publicationContext as ChapterPublicationContext).partOf} />
              <PublicPublicationInstanceChapter
                publicationInstance={publicationInstance as ChapterPublicationInstance}
              />
            </>
          ) : null)}
      </div>
    </StyledGeneralInfo>
  );
};
