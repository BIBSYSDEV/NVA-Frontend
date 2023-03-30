import { useTranslation } from 'react-i18next';
import { Typography, Link } from '@mui/material';
import { getLanguageByUri } from 'nva-language';
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
import { ArtisticType, DegreeType, JournalType } from '../../types/publicationFieldNames';
import {
  isArtistic,
  isBook,
  isChapter,
  isDegree,
  isJournal,
  isMediaContribution,
  isPeriodicalMediaContribution,
  isOtherRegistration,
  isPresentation,
  isReport,
} from '../../utils/registration-helpers';
import { PublicDoi } from './PublicDoi';
import {
  PublicArtisticOutput,
  PublicJournal,
  PublicPartOfContent,
  PublicPresentation,
  PublicPublicationContextMediaContribution,
  PublicPublisher,
  PublicSeries,
} from './PublicPublicationContext';
import {
  PublicIsbnContent,
  PublicPublicationInstanceArtistic,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceChapter,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceReport,
} from './PublicPublicationInstance';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { RegistrationSummary } from './RegistrationSummary';
import { dataTestId } from '../../utils/dataTestIds';
import { displayDate } from '../../utils/date-helpers';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import { ArtisticPublicationInstance } from '../../types/publication_types/artisticRegistration.types';
import { StyledGeneralInfo } from '../../components/styled/Wrappers';
import {
  MediaContributionPeriodicalPublicationContext,
  MediaContributionPublicationContext,
} from '../../types/publication_types/mediaContributionRegistration.types';
import { MapPublicationContext } from '../../types/publication_types/otherRegistration.types';

export const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t, i18n } = useTranslation();
  const { entityDescription } = registration;

  const publicationContext = entityDescription?.reference?.publicationContext;
  const publicationInstance = entityDescription?.reference?.publicationInstance;
  const journalPublicationInstance = entityDescription?.reference?.publicationInstance as
    | JournalPublicationInstance
    | undefined;

  const language = entityDescription?.language ? getLanguageByUri(entityDescription.language) : null;

  return (
    <StyledGeneralInfo>
      <div data-testid={dataTestId.registrationLandingPage.generalInfo}>
        <Typography variant="h3" component="h2">
          {t('registration.public_page.about_registration')}
        </Typography>

        <Typography>{displayDate(entityDescription?.date)}</Typography>

        {language && (
          <Typography data-testid={dataTestId.registrationLandingPage.primaryLanguage}>
            {i18n.language === 'nob' ? language.nob : language.eng}
          </Typography>
        )}

        {entityDescription?.npiSubjectHeading && (
          <Typography data-testid={dataTestId.registrationLandingPage.npi}>
            {t('registration.description.npi_disciplines')}:{' '}
            {t(`disciplines.${entityDescription.npiSubjectHeading}` as any)}
          </Typography>
        )}

        {publicationInstance &&
          ((isJournal(publicationInstance.type) || isPeriodicalMediaContribution(publicationInstance.type)) &&
          journalPublicationInstance ? (
            <PublicPublicationInstanceJournal publicationInstance={journalPublicationInstance} />
          ) : isBook(publicationInstance.type) ? (
            <>
              <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
              <PublicIsbnContent
                isbnList={(registration as BookRegistration).entityDescription.reference?.publicationContext.isbnList}
              />
            </>
          ) : isDegree(publicationInstance.type) ? (
            <>
              {publicationInstance.type === DegreeType.Phd && (
                <PublicIsbnContent
                  isbnList={
                    (registration as DegreeRegistration).entityDescription.reference?.publicationContext.isbnList
                  }
                />
              )}
              <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
            </>
          ) : isReport(publicationInstance.type) ? (
            <>
              <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
              <PublicIsbnContent
                isbnList={(registration as ReportRegistration).entityDescription.reference?.publicationContext.isbnList}
              />
            </>
          ) : isChapter(publicationInstance.type) ? (
            <PublicPublicationInstanceChapter publicationInstance={publicationInstance as ChapterPublicationInstance} />
          ) : isArtistic(publicationInstance.type) ? (
            <PublicPublicationInstanceArtistic
              publicationInstance={publicationInstance as ArtisticPublicationInstance}
            />
          ) : null)}

        <PublicDoi registration={registration} />

        {registration.handle && (
          <>
            <Typography variant="overline">{t('registration.public_page.handle')}</Typography>
            <Typography>
              <Link
                data-testid={dataTestId.registrationLandingPage.handleLink}
                href={registration.handle}
                target="_blank"
                rel="noopener noreferrer">
                {registration.handle}
              </Link>
            </Typography>
          </>
        )}
      </div>

      <div data-testid={dataTestId.registrationLandingPage.subtypeFields}>
        {publicationInstance &&
          (isJournal(publicationInstance.type) && journalPublicationInstance ? (
            <>
              <PublicJournal publicationContext={publicationContext as JournalPublicationContext} />
              {publicationInstance.type === JournalType.Corrigendum && (
                <>
                  <Typography variant="overline" component="p">
                    {t('registration.resource_type.original_article')}
                  </Typography>
                  <RegistrationSummary id={journalPublicationInstance.corrigendumFor ?? ''} />
                </>
              )}
            </>
          ) : isBook(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as BookPublicationContext).publisher} />
              <PublicSeries publicationContext={publicationContext as BookPublicationContext} />
            </>
          ) : isDegree(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as DegreePublicationContext).publisher} />
              {publicationInstance.type === DegreeType.Phd && (
                <PublicSeries publicationContext={publicationContext as DegreePublicationContext} />
              )}
            </>
          ) : isReport(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as ReportPublicationContext).publisher} />
              <PublicSeries publicationContext={publicationContext as ReportPublicationContext} />
            </>
          ) : isChapter(publicationInstance.type) ? (
            <PublicPartOfContent partOf={(publicationContext as ChapterPublicationContext).partOf} />
          ) : isPresentation(publicationInstance.type) ? (
            <PublicPresentation publicationContext={publicationContext as PresentationPublicationContext} />
          ) : isArtistic(publicationInstance.type) ? (
            (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.ArtisticDesign ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).venues ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.ArtisticArchitecture ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).architectureOutput ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
                showType
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.PerformingArts ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).outputs ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.MovingPicture ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).outputs ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.MusicPerformance ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).manifestations ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.VisualArts ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).venues ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.LiteraryArts ? (
              <PublicArtisticOutput
                outputs={(publicationInstance as ArtisticPublicationInstance).manifestations ?? []}
                heading={t('registration.resource_type.artistic.announcements')}
              />
            ) : null
          ) : isMediaContribution(publicationInstance.type) ? (
            isPeriodicalMediaContribution(publicationInstance.type) ? (
              <PublicJournal publicationContext={publicationContext as MediaContributionPeriodicalPublicationContext} />
            ) : (
              <PublicPublicationContextMediaContribution
                publicationContext={publicationContext as MediaContributionPublicationContext}
              />
            )
          ) : isOtherRegistration(publicationInstance.type) ? (
            <PublicPublisher publisher={(publicationContext as MapPublicationContext).publisher} />
          ) : null)}
      </div>
    </StyledGeneralInfo>
  );
};
