import { Box, Link, Typography } from '@mui/material';
import { getLanguageByUri } from 'nva-language';
import { useTranslation } from 'react-i18next';
import { useNviCandidateQuery } from '../../api/hooks/useNviCandidateQuery';
import { StyledGeneralInfo } from '../../components/styled/Wrappers';
import disciplines from '../../resources/disciplines.json';
import { ArtisticPublicationInstance } from '../../types/publication_types/artisticRegistration.types';
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
import { ExhibitionPublicationInstance } from '../../types/publication_types/exhibitionContent.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../types/publication_types/journalRegistration.types';
import {
  MediaContributionPeriodicalPublicationContext,
  MediaContributionPublicationContext,
} from '../../types/publication_types/mediaContributionRegistration.types';
import { MapPublicationContext } from '../../types/publication_types/otherRegistration.types';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import {
  ReportPublicationContext,
  ReportPublicationInstance,
  ReportRegistration,
} from '../../types/publication_types/reportRegistration.types';
import { ArtisticType, DegreeType, JournalType } from '../../types/publicationFieldNames';
import { dataTestId } from '../../utils/dataTestIds';
import { displayDate } from '../../utils/date-helpers';
import {
  findParentSubject,
  isArtistic,
  isBook,
  isChapter,
  isDegree,
  isExhibitionContent,
  isJournal,
  isMediaContribution,
  isOtherRegistration,
  isPeriodicalMediaContribution,
  isPresentation,
  isReport,
} from '../../utils/registration-helpers';
import { ChapterPublisherInfo } from './ChapterPublisherInfo';
import { PublicDoi } from './PublicDoi';
import {
  PublicJournal,
  PublicOutputs,
  PublicPresentation,
  PublicPublicationContextMediaContribution,
  PublicPublishedInContent,
  PublicPublisher,
  PublicSeries,
  RevisionInformation,
} from './PublicPublicationContext';
import {
  PublicIsbnContent,
  PublicPublicationInstanceArtistic,
  PublicPublicationInstanceBook,
  PublicPublicationInstanceChapter,
  PublicPublicationInstanceDegree,
  PublicPublicationInstanceExhibition,
  PublicPublicationInstanceJournal,
  PublicPublicationInstanceReport,
} from './PublicPublicationInstance';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { RegistrationSummary } from './RegistrationSummary';

export const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t, i18n } = useTranslation();
  const { entityDescription, id, status } = registration;
  const nviCandidateQuery = useNviCandidateQuery(id, status);

  const publicationContext = entityDescription?.reference?.publicationContext;
  const publicationInstance = entityDescription?.reference?.publicationInstance;
  const journalPublicationInstance = entityDescription?.reference?.publicationInstance as
    | JournalPublicationInstance
    | undefined;

  const language = entityDescription?.language ? getLanguageByUri(entityDescription.language) : null;

  const cristinIdentifier = registration.additionalIdentifiers?.find(
    (identifier) => identifier.sourceName === 'Cristin'
  )?.value;
  const scopusIdentifier = registration.additionalIdentifiers?.find(
    (identifier) => identifier.sourceName === 'Scopus'
  )?.value;

  const isNviReported = nviCandidateQuery.isSuccess && nviCandidateQuery.data.status === 'Reported';
  const reportedYear = nviCandidateQuery.data?.period.year;

  return (
    <StyledGeneralInfo>
      <div data-testid={dataTestId.registrationLandingPage.generalInfo}>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('registration.public_page.about_registration')}
        </Typography>
        <Typography>{`${displayDate(entityDescription?.publicationDate)}${isNviReported && reportedYear ? ` (${t('basic_data.nvi.nvi_reporting_year')}: ${reportedYear})` : ''}`}</Typography>
        {language && (
          <Typography data-testid={dataTestId.registrationLandingPage.primaryLanguage}>
            {i18n.language === 'nob' ? language.nob : language.eng}
          </Typography>
        )}
        {entityDescription?.npiSubjectHeading && (
          <Typography data-testid={dataTestId.registrationLandingPage.npi}>
            {t('registration.description.npi_disciplines')}:{' '}
            {t(`disciplines.${entityDescription.npiSubjectHeading}` as any)} (
            {t(`disciplines.${findParentSubject(disciplines, entityDescription.npiSubjectHeading)}` as any)})
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
              <RevisionInformation revision={(publicationContext as BookPublicationContext).revision} />
            </>
          ) : isDegree(publicationInstance.type) ? (
            <>
              {(publicationContext as DegreePublicationContext)?.course?.code &&
                (publicationInstance.type === DegreeType.Bachelor ||
                  publicationInstance.type === DegreeType.Master ||
                  publicationInstance.type === DegreeType.Other) && (
                  <Typography>
                    {t('registration.resource_type.course_code')}:{' '}
                    {(publicationContext as DegreePublicationContext).course?.code}
                  </Typography>
                )}

              {publicationInstance.type !== DegreeType.Bachelor && publicationInstance.type !== DegreeType.Master && (
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
          ) : isExhibitionContent(publicationInstance.type) ? (
            <PublicPublicationInstanceExhibition
              publicationInstance={publicationInstance as ExhibitionPublicationInstance}
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
        {(cristinIdentifier || scopusIdentifier) && (
          <Box sx={{ display: 'flex', columnGap: '2rem', flexWrap: 'wrap' }}>
            {cristinIdentifier && (
              <div>
                <Typography variant="overline">{t('registration.public_page.cristin_id')}</Typography>
                <Typography>
                  <Link
                    data-testid={dataTestId.registrationLandingPage.cristinLink}
                    href={`https://app.cristin.no/results/show.jsf?id=${cristinIdentifier}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    {cristinIdentifier}
                  </Link>
                </Typography>
              </div>
            )}
            {scopusIdentifier && (
              <div>
                <Typography variant="overline">{t('registration.public_page.scopus_id')}</Typography>
                <Typography>{scopusIdentifier}</Typography>
              </div>
            )}
          </Box>
        )}
        <Typography variant="overline">{t('registration.registration_id')}</Typography>
        <Typography>{registration.identifier}</Typography>
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
              {(publicationInstance.type === DegreeType.Phd || publicationInstance.type === DegreeType.Licentiate) && (
                <PublicSeries publicationContext={publicationContext as DegreePublicationContext} />
              )}
            </>
          ) : isReport(publicationInstance.type) ? (
            <>
              <PublicPublisher publisher={(publicationContext as ReportPublicationContext).publisher} />
              <PublicSeries publicationContext={publicationContext as ReportPublicationContext} />
            </>
          ) : isChapter(publicationInstance.type) ? (
            <>
              <PublicPublishedInContent id={(publicationContext as ChapterPublicationContext).id} />
              <ChapterPublisherInfo publicationContext={publicationContext as ChapterPublicationContext} />
            </>
          ) : isPresentation(publicationInstance.type) ? (
            <PublicPresentation publicationContext={publicationContext as PresentationPublicationContext} />
          ) : isArtistic(publicationInstance.type) ? (
            (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.ArtisticDesign ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).venues ?? []} />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.ArtisticArchitecture ? (
              <PublicOutputs
                outputs={(publicationInstance as ArtisticPublicationInstance).architectureOutput ?? []}
                showType
              />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.PerformingArts ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).outputs ?? []} />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.MovingPicture ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).outputs ?? []} />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.MusicPerformance ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).manifestations ?? []} />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.VisualArts ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).venues ?? []} />
            ) : (publicationInstance as ArtisticPublicationInstance).type === ArtisticType.LiteraryArts ? (
              <PublicOutputs outputs={(publicationInstance as ArtisticPublicationInstance).manifestations ?? []} />
            ) : null
          ) : isMediaContribution(publicationInstance.type) ? (
            isPeriodicalMediaContribution(publicationInstance.type) ? (
              <PublicJournal publicationContext={publicationContext as MediaContributionPeriodicalPublicationContext} />
            ) : (
              <PublicPublicationContextMediaContribution
                publicationContext={publicationContext as MediaContributionPublicationContext}
              />
            )
          ) : isExhibitionContent(publicationInstance.type) ? (
            <PublicOutputs
              outputs={(publicationInstance as ExhibitionPublicationInstance).manifestations ?? []}
              showType
            />
          ) : isOtherRegistration(publicationInstance.type) ? (
            <PublicPublisher publisher={(publicationContext as MapPublicationContext).publisher} />
          ) : null)}
      </div>
    </StyledGeneralInfo>
  );
};
