import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from '@tanstack/react-query';
import { hyphenate } from 'isbn-utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { fetchRegistration } from '../../api/registrationApi';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ListSkeleton } from '../../components/ListSkeleton';
import { NpiLevelTypography } from '../../components/NpiLevelTypography';
import { setNotification } from '../../redux/notificationSlice';
import {
  AudioVisualPublication,
  Award,
  Broadcast,
  CinematicRelease,
  Competition,
  Concert,
  Exhibition,
  LiteraryArtsAudioVisual,
  LiteraryArtsAudioVisualSubtype,
  LiteraryArtsMonograph,
  LiteraryArtsPerformance,
  LiteraryArtsPerformanceSubtype,
  LiteraryArtsWeb,
  MentionInPublication,
  MusicScore,
  OtherMusicPerformance,
  OtherRelease,
  Venue,
} from '../../types/publication_types/artisticRegistration.types';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import {
  ExhibitionBasic,
  ExhibitionMentionInPublication,
  ExhibitionOtherPresentation,
} from '../../types/publication_types/exhibitionContent.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import {
  MediaContributionPeriodicalPublicationContext,
  MediaContributionPublicationContext,
} from '../../types/publication_types/mediaContributionRegistration.types';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { ContextPublisher, Journal, Publisher } from '../../types/registration.types';
import { getIdentifierFromId, getPeriodString } from '../../utils/general-helpers';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getOutputName, hyphenateIsrc } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { OutputItem } from '../registration/resource_type_tab/sub_type_forms/artistic_types/OutputRow';
import { RegistrationSummary } from './RegistrationSummary';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext | MediaContributionPeriodicalPublicationContext;
}

const channelRegisterBaseUrl = 'https://kanalregister.hkdir.no/publiseringskanaler';
export const getChannelRegisterJournalUrl = (id: string) =>
  `${channelRegisterBaseUrl}/KanalTidsskriftInfo.action?id=${id}`;
export const getChannelRegisterPublisherUrl = (id: string) =>
  `${channelRegisterBaseUrl}/KanalForlagInfo.action?id=${id}`;

export const PublicJournal = ({ publicationContext }: PublicJournalProps) => {
  const { t } = useTranslation();

  return publicationContext.id || publicationContext.title ? (
    <>
      <Typography variant="h3" component="p">
        {t('registration.resource_type.journal')}
      </Typography>
      {publicationContext.id ? (
        <PublicJournalContent id={publicationContext.id} errorMessage={t('feedback.error.get_journal')} />
      ) : (
        <Typography>{publicationContext.title}</Typography>
      )}
    </>
  ) : null;
};

export const PublicPublisher = ({ publisher }: { publisher?: ContextPublisher }) => {
  const { t } = useTranslation();

  const [fetchedPublisher, isLoadingPublisher] = useFetchResource<Publisher>(
    publisher?.id ?? '',
    t('feedback.error.get_publisher')
  );

  return publisher?.id || publisher?.name ? (
    <>
      <Typography variant="h3" component="p">
        {t('common.publisher')}
      </Typography>

      {isLoadingPublisher ? (
        <ListSkeleton height={20} />
      ) : fetchedPublisher ? (
        <>
          <Typography>{fetchedPublisher.name}</Typography>
          <NpiLevelTypography level={fetchedPublisher.level} />
          <Typography
            component={Link}
            href={getChannelRegisterPublisherUrl(fetchedPublisher.identifier)}
            target="_blank">
            {t('registration.public_page.find_in_channel_registry')}
          </Typography>
        </>
      ) : (
        <Typography>{publisher.name}</Typography>
      )}
    </>
  ) : null;
};

export const PublicPublishedInContent = ({ id }: { id: string | null }) => {
  const { t } = useTranslation();

  return id ? (
    <>
      <Typography variant="h3" component="p">
        {t('registration.resource_type.chapter.published_in')}
      </Typography>
      <RegistrationSummary id={id} />
    </>
  ) : null;
};

export const PublicSeries = ({
  publicationContext,
}: {
  publicationContext: BookPublicationContext | ReportPublicationContext | DegreePublicationContext;
}) => {
  const { t } = useTranslation();
  const { series, seriesNumber } = publicationContext;

  return series?.id || series?.title ? (
    <>
      <Typography variant="h3" component="p">
        {t('registration.resource_type.series')}
      </Typography>
      {series.id ? (
        <PublicJournalContent id={series.id} errorMessage={t('feedback.error.get_series')} />
      ) : (
        <Typography>{series.title}</Typography>
      )}
      {seriesNumber && (
        <Typography>
          {t('registration.resource_type.series_number')}: {seriesNumber}
        </Typography>
      )}
    </>
  ) : null;
};

interface PublicJournalContentProps {
  id?: string;
  errorMessage: string;
}

const PublicJournalContent = ({ id, errorMessage }: PublicJournalContentProps) => {
  const { t } = useTranslation();
  const [journal, isLoadingJournal] = useFetchResource<Journal>(id ?? '', errorMessage);

  return id ? (
    <>
      {isLoadingJournal ? (
        <ListSkeleton height={20} />
      ) : (
        journal && (
          <>
            <Typography>{journal.name}</Typography>
            <Typography>
              {[
                journal.printIssn ? `${t('registration.resource_type.print_issn')}: ${journal.printIssn}` : '',
                journal.onlineIssn ? `${t('registration.resource_type.online_issn')}: ${journal.onlineIssn}` : '',
              ]
                .filter((issn) => issn)
                .join(', ')}
            </Typography>
            <NpiLevelTypography level={journal.level} />
            <Typography component={Link} href={getChannelRegisterJournalUrl(journal.identifier)} target="_blank">
              {t('registration.public_page.find_in_channel_registry')}
            </Typography>
          </>
        )
      )}
    </>
  ) : null;
};

interface PublicPresentationProps {
  publicationContext: PresentationPublicationContext;
}

export const PublicPresentation = ({ publicationContext }: PublicPresentationProps) => {
  const { t } = useTranslation();
  const { type, time, place, label, agent } = publicationContext;
  const periodString = getPeriodString(time?.from, time?.to);

  return (
    <>
      <Typography variant="h3">{t(`registration.publication_types.${type}`)}</Typography>
      {label && <Typography>{label}</Typography>}
      {agent?.name && (
        <Typography>
          {t('registration.resource_type.organizer')}: {agent.name}
        </Typography>
      )}
      {place?.label && (
        <Typography>
          {t('registration.resource_type.place_for_event')}: {place.label}
        </Typography>
      )}
      {place?.country && (
        <Typography>
          {t('common.country')}: {place.country}
        </Typography>
      )}
      {periodString && <Typography>{periodString}</Typography>}
    </>
  );
};

interface PublicOutputsProps {
  outputs: OutputItem[];
  showType?: boolean;
}

export const PublicOutputs = ({ outputs, showType = false }: PublicOutputsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.artistic.announcements')}
      </Typography>
      {outputs.map((output, index) => (
        <PublicOutputRow key={index} output={output} showType={showType} />
      ))}
    </>
  );
};

interface PublicOutputRowProps {
  output: OutputItem;
  showType: boolean;
}

const PublicOutputRow = ({ output, showType }: PublicOutputRowProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const exhibitionCatalogIdentifier =
    output.type === 'ExhibitionCatalog' && output.id ? getIdentifierFromId(output.id) : '';

  const exhibitionCatalogQuery = useQuery({
    enabled: !!exhibitionCatalogIdentifier,
    queryKey: ['registration', exhibitionCatalogIdentifier],
    queryFn: () => fetchRegistration(exhibitionCatalogIdentifier),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_registration'), variant: 'error' })),
  });

  const nameString = exhibitionCatalogIdentifier
    ? exhibitionCatalogQuery.data?.entityDescription?.mainTitle
    : getOutputName(output);

  const rowString = showType
    ? `${nameString} (${t(`registration.resource_type.artistic.output_type.${output.type}` as any)})`
    : nameString;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Typography>{rowString}</Typography>
      <Tooltip title={t('common.show_details')}>
        <IconButton
          size="small"
          color="primary"
          onClick={exhibitionCatalogIdentifier ? undefined : toggleModal}
          href={exhibitionCatalogIdentifier ? getRegistrationLandingPagePath(exhibitionCatalogIdentifier) : ''}
          target="_blank">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={openModal} onClose={toggleModal} fullWidth>
        <DialogTitle>{t('registration.resource_type.artistic.announcement')}</DialogTitle>
        <ErrorBoundary>
          {output.type === 'Venue' || output.type === 'PerformingArtsVenue' ? (
            <PublicVenueDialogContent venue={output as Venue} />
          ) : output.type === 'Competition' ? (
            <PublicCompetitionDialogContent competition={output as Competition} />
          ) : output.type === 'Award' ? (
            <PublicAwardDialogContent award={output as Award} />
          ) : output.type === 'MentionInPublication' ? (
            <PublicMentionDialogContent mention={output as MentionInPublication} />
          ) : output.type === 'Exhibition' ? (
            <PublicExhibitionDialogContent exhibition={output as Exhibition} />
          ) : output.type === 'Broadcast' ? (
            <PublicBroadcastDialogContent broadcast={output as Broadcast} />
          ) : output.type === 'CinematicRelease' ? (
            <PublicCinematicReleaseDialogContent cinematicRelease={output as CinematicRelease} />
          ) : output.type === 'OtherRelease' ? (
            <PublicOtherReleaseDialogContent otherRelease={output as OtherRelease} />
          ) : output.type === 'MusicScore' ? (
            <PublicMusicScoreDialogContent musicScore={output as MusicScore} />
          ) : output.type === 'AudioVisualPublication' ? (
            <PublicAudioVisualPublicationDialogContent audioVisualPublication={output as AudioVisualPublication} />
          ) : output.type === 'Concert' ? (
            <PublicConcertDialogContent concert={output as Concert} />
          ) : output.type === 'OtherPerformance' ? (
            <PublicOtherPerformanceDialogContent otherPerformance={output as OtherMusicPerformance} />
          ) : output.type === 'LiteraryArtsMonograph' ? (
            <PublicLiteraryArtsMonographDialogContent literaryArtsMonograph={output as LiteraryArtsMonograph} />
          ) : output.type === 'LiteraryArtsWeb' ? (
            <PublicLiteraryArtsWebPublicationDialogContent webPublication={output as LiteraryArtsWeb} />
          ) : output.type === 'LiteraryArtsPerformance' ? (
            <PublicLiteraryArtsPerformanceDialogContent performance={output as LiteraryArtsPerformance} />
          ) : output.type === 'LiteraryArtsAudioVisual' ? (
            <PublicLiteraryArtsAudioVisualDialogContent audioVisual={output as LiteraryArtsAudioVisual} />
          ) : output.type === 'ExhibitionBasic' ? (
            <PublicExhibitionBasicDialogContent exhibitionBasic={output as ExhibitionBasic} />
          ) : output.type === 'ExhibitionMentionInPublication' ? (
            <PublicExhibitionMentionInPublicationDialogContent
              exhibitionMentionInPublication={output as ExhibitionMentionInPublication}
            />
          ) : output.type === 'ExhibitionOtherPresentation' ? (
            <PublicExhibitionOtherPresentationDialogContent
              exhibitionOtherPresentation={output as ExhibitionOtherPresentation}
            />
          ) : null}
        </ErrorBoundary>

        <DialogActions>
          <Button variant="outlined" onClick={toggleModal}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PublicExhibitionBasicDialogContent = ({ exhibitionBasic }: { exhibitionBasic: ExhibitionBasic }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3" gutterBottom>
        {t('common.type')}
      </Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${exhibitionBasic.type}`)}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.exhibition_production.institution_name')}
      </Typography>
      <Typography paragraph>{exhibitionBasic.organization.name || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('common.place')}
      </Typography>
      <Typography paragraph>{exhibitionBasic.place?.label || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('common.date')}
      </Typography>
      <Typography>{getPeriodString(exhibitionBasic.date?.from, exhibitionBasic.date?.to)}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionMentionInPublicationDialogContent = ({
  exhibitionMentionInPublication,
}: {
  exhibitionMentionInPublication: ExhibitionMentionInPublication;
}) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3" gutterBottom>
        {t('common.type')}
      </Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${exhibitionMentionInPublication.type}`)}
      </Typography>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.journal_book_medium')}
      </Typography>
      <Typography paragraph>{exhibitionMentionInPublication.title || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.issue')}
      </Typography>
      <Typography paragraph>{exhibitionMentionInPublication.issue || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('common.date')}
      </Typography>
      <Typography paragraph>
        {exhibitionMentionInPublication.date?.value
          ? new Date(exhibitionMentionInPublication.date.value).toLocaleDateString()
          : '-'}
      </Typography>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.other_publisher_isbn_etc')}
      </Typography>
      <Typography paragraph>{exhibitionMentionInPublication.otherInformation || '-'}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionOtherPresentationDialogContent = ({
  exhibitionOtherPresentation,
}: {
  exhibitionOtherPresentation: ExhibitionOtherPresentation;
}) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3" gutterBottom>
        {t('common.type')}
      </Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${exhibitionOtherPresentation.type}`)}
      </Typography>

      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.exhibition_production.presentation_type')}
      </Typography>
      <Typography paragraph>{exhibitionOtherPresentation.typeDescription || '-'}</Typography>

      <Typography variant="h3" gutterBottom>
        {t('common.place')}
      </Typography>
      <Typography paragraph>{exhibitionOtherPresentation.place.label || '-'}</Typography>

      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.publisher_or_organizer')}
      </Typography>
      <Typography paragraph>{exhibitionOtherPresentation.publisher.name || '-'}</Typography>

      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.exhibition_production.more_info_about_elementet')}
      </Typography>
      <Typography paragraph>{exhibitionOtherPresentation.description || '-'}</Typography>

      <Typography variant="h3" gutterBottom>
        {t('common.date')}
      </Typography>
      <Typography paragraph>
        {exhibitionOtherPresentation.date?.value
          ? new Date(exhibitionOtherPresentation.date.value).toLocaleDateString()
          : '-'}
      </Typography>
    </DialogContent>
  );
};

const PublicVenueDialogContent = ({ venue }: { venue: Venue }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{venue.place?.label ?? ''}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{getPeriodString(venue.date?.from, venue.date?.to)}</Typography>
    </DialogContent>
  );
};

const PublicCompetitionDialogContent = ({ competition }: { competition: Competition }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{competition.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.competition_rank')}</Typography>
      <Typography paragraph>{competition.description}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{new Date(competition.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicAwardDialogContent = ({ award }: { award: Award }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{award.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_organizer')}</Typography>
      <Typography paragraph>{award.organizer}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography>{new Date(award.date.value).getFullYear()}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_ranking')}</Typography>
      <Typography paragraph>{award.ranking}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_other_type')}</Typography>
      <Typography paragraph>{award.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicMentionDialogContent = ({ mention }: { mention: MentionInPublication }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.journal_book_medium')}</Typography>
      <Typography paragraph>{mention.title}</Typography>
      <Typography variant="h3">{t('registration.resource_type.issue')}</Typography>
      <Typography paragraph>{mention.issue}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{new Date(mention.date.value).toLocaleDateString()}</Typography>
      <Typography variant="h3">{t('registration.resource_type.other_publisher_isbn_etc')}</Typography>
      <Typography paragraph>{mention.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionDialogContent = ({ exhibition }: { exhibition: Exhibition }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.exhibition_title')}</Typography>
      <Typography paragraph>{exhibition.name}</Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{exhibition.place?.label ?? ''}</Typography>
      <Typography variant="h3">{t('registration.resource_type.organizer')}</Typography>
      <Typography>{exhibition.organizer}</Typography>
      <Typography variant="h3">{t('common.other')}</Typography>
      <Typography paragraph>{exhibition.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicBroadcastDialogContent = ({ broadcast }: { broadcast: Broadcast }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${broadcast.type}`)}</Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography paragraph>{broadcast.publisher.name}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{new Date(broadcast.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicCinematicReleaseDialogContent = ({ cinematicRelease }: { cinematicRelease: CinematicRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${cinematicRelease.type}`)}</Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{cinematicRelease.place.label}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(cinematicRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicOtherReleaseDialogContent = ({ otherRelease }: { otherRelease: OtherRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.other_release_description')}</Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${otherRelease.type}`)}: {otherRelease.description}
      </Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{otherRelease.place.label}</Typography>
      {otherRelease.publisher.name && (
        <>
          <Typography variant="h3">{t('registration.resource_type.artistic.other_announcement_organizer')}</Typography>
          <Typography paragraph>{otherRelease.publisher.name}</Typography>
        </>
      )}
      <Typography variant="h3">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(otherRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicMusicScoreDialogContent = ({ musicScore }: { musicScore: MusicScore }) => {
  const { t } = useTranslation();
  const { type, ensemble, movements, extent, publisher, ismn } = musicScore;

  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_ensemble')}</Typography>
      <Typography paragraph>{ensemble}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_movements')}</Typography>
      <Typography paragraph>{movements}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.extent')}</Typography>
      <Typography paragraph>{extent}</Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography paragraph>{publisher.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_ismn')}</Typography>
      <Typography paragraph>{ismn?.formatted ?? ismn?.value ?? '-'}</Typography>
    </DialogContent>
  );
};

const PublicAudioVisualPublicationDialogContent = ({
  audioVisualPublication,
}: {
  audioVisualPublication: AudioVisualPublication;
}) => {
  const { t } = useTranslation();
  const { type, mediaType, publisher, catalogueNumber, isrc, trackList } = audioVisualPublication;

  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.media_type')}</Typography>
      <Typography paragraph>
        {mediaType.type
          ? mediaType.type !== 'MusicMediaOther'
            ? t(`registration.resource_type.artistic.music_media_type.${mediaType.type}`)
            : mediaType.description
          : ''}
      </Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography paragraph>{publisher.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.catalogue_number')}</Typography>
      <Typography paragraph>{catalogueNumber ? catalogueNumber : '-'}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_isrc')}</Typography>
      <Typography paragraph>{isrc?.value ? hyphenateIsrc(isrc?.value) : '-'}</Typography>
      <Typography variant="h3" id="tracks-heading">
        {t('registration.resource_type.artistic.content_track')}
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-labelledby="tracks-heading">
          <caption style={visuallyHidden}>
            {t('registration.resource_type.artistic.content_track_table_caption')}
          </caption>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.title')}</TableCell>
              <TableCell>{t('registration.resource_type.artistic.composer')}</TableCell>
              <TableCell>{t('registration.resource_type.artistic.extent_in_minutes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trackList.map((track, index) => (
              <TableRow key={index}>
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.composer}</TableCell>
                <TableCell>{track.extent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  );
};

const PublicConcertDialogContent = ({ concert }: { concert: Concert }) => {
  const { t } = useTranslation();
  const { type, place, time, extent, concertProgramme, concertSeries } = concert;

  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{place.label}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.concert_part_of_series')}</Typography>
      <Typography paragraph>{concertSeries ? t('common.yes') : t('common.no')} </Typography>
      {concertSeries && (
        <>
          <Typography variant="h3">{t('common.description')} </Typography>
          <Typography paragraph>{concertSeries}</Typography>
        </>
      )}

      <Typography variant="h3">{t('common.date')}</Typography>
      {time.type === 'Instant' ? (
        <Typography paragraph>{new Date(time.value).toLocaleDateString()}</Typography>
      ) : (
        <Typography paragraph>{getPeriodString(time.from, time.to)}</Typography>
      )}

      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography paragraph>{extent}</Typography>

      <Typography variant="h3" id="program-heading">
        {t('registration.resource_type.artistic.program')}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-labelledby="program-heading">
          <caption style={visuallyHidden}>{t('registration.resource_type.artistic.program_table_caption')}</caption>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.title')}</TableCell>
              <TableCell>{t('registration.resource_type.artistic.composer')}</TableCell>
              <TableCell>{t('registration.resource_type.artistic.premiere')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {concertProgramme.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.composer}</TableCell>
                <TableCell>{item.premiere ? t('common.yes') : null}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  );
};

const PublicOtherPerformanceDialogContent = ({ otherPerformance }: { otherPerformance: OtherMusicPerformance }) => {
  const { t } = useTranslation();
  const { type, place, performanceType, extent, musicalWorks } = otherPerformance;

  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.performance_type')}</Typography>
      <Typography paragraph>{performanceType}</Typography>

      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{place.label}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography paragraph>{extent}</Typography>

      <Typography variant="h3" id="works-heading">
        {t('registration.resource_type.artistic.musical_works')}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-labelledby="works-heading">
          <caption style={visuallyHidden}>
            {t('registration.resource_type.artistic.musical_works_table_caption')}
          </caption>
          <TableHead>
            <TableRow>
              <TableCell>{t('common.title')}</TableCell>
              <TableCell>{t('registration.resource_type.artistic.composer')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {musicalWorks.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.composer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </DialogContent>
  );
};

const PublicLiteraryArtsMonographDialogContent = ({
  literaryArtsMonograph,
}: {
  literaryArtsMonograph: LiteraryArtsMonograph;
}) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${literaryArtsMonograph.type}`)}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography paragraph>{literaryArtsMonograph.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography paragraph>{literaryArtsMonograph.publicationDate.year}</Typography>
      <Typography variant="h3">{t('registration.resource_type.isbn')}</Typography>
      <Typography paragraph>
        {literaryArtsMonograph.isbnList
          .filter((isbn) => isbn)
          .map((isbn) => hyphenate(isbn))
          .join(', ')}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.number_of_pages')}</Typography>
      <Typography>{literaryArtsMonograph.pages.pages ?? '-'}</Typography>
    </DialogContent>
  );
};

const PublicLiteraryArtsWebPublicationDialogContent = ({ webPublication }: { webPublication: LiteraryArtsWeb }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${webPublication.type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.web_link')}</Typography>
      <Typography paragraph>
        <Link href={webPublication.id} target="_blank" rel="noopener noreferrer">
          {webPublication.id}
        </Link>
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography paragraph>{webPublication.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography paragraph>{webPublication.publicationDate.year}</Typography>
    </DialogContent>
  );
};

const PublicLiteraryArtsPerformanceDialogContent = ({ performance }: { performance: LiteraryArtsPerformance }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${performance.type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.type_work')}</Typography>
      <Typography paragraph>
        {performance.subtype.type
          ? performance.subtype.type === LiteraryArtsPerformanceSubtype.Other
            ? performance.subtype.description
            : t(`registration.resource_type.artistic.performance_types.${performance.subtype.type}`)
          : '-'}
      </Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography paragraph>{performance.place.label}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography paragraph>
        {new Date(
          +performance.publicationDate.year,
          +performance.publicationDate.month,
          +performance.publicationDate.day
        ).toLocaleDateString()}
      </Typography>
    </DialogContent>
  );
};

const PublicLiteraryArtsAudioVisualDialogContent = ({ audioVisual }: { audioVisual: LiteraryArtsAudioVisual }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${audioVisual.type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.type_work')}</Typography>
      <Typography paragraph>
        {audioVisual.subtype.type
          ? audioVisual.subtype.type === LiteraryArtsAudioVisualSubtype.Other
            ? audioVisual.subtype.description
            : t(`registration.resource_type.artistic.audio_video_type.${audioVisual.subtype.type}`)
          : '-'}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography paragraph>{audioVisual.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography paragraph>{audioVisual.publicationDate.year ?? '-'}</Typography>
      <Typography variant="h3">{t('registration.resource_type.isbn')}</Typography>
      <Typography paragraph>
        {audioVisual.isbnList
          .filter((isbn) => isbn)
          .map((isbn) => hyphenate(isbn))
          .join(', ')}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography paragraph>{audioVisual.extent ?? '-'}</Typography>
    </DialogContent>
  );
};

interface PublicMediaContributionProps {
  publicationContext: MediaContributionPublicationContext;
}

export const PublicPublicationContextMediaContribution = ({ publicationContext }: PublicMediaContributionProps) => {
  const { t } = useTranslation();
  const { medium, format, disseminationChannel, partOf } = publicationContext;

  return (
    <>
      {medium.type && (
        <Typography>
          {t('registration.resource_type.media_contribution.medium')}:{' '}
          {t(`registration.resource_type.media_contribution.medium_types.${medium.type}`)}
        </Typography>
      )}
      {format && (
        <Typography>
          {t('registration.resource_type.media_contribution.format')}:{' '}
          {t(`registration.resource_type.media_contribution.format_types.${format}`)}
        </Typography>
      )}
      {disseminationChannel && (
        <Typography>
          {t('registration.resource_type.media_contribution.channel')}: {disseminationChannel}
        </Typography>
      )}
      {partOf?.seriesName && (
        <Typography>
          {t('registration.resource_type.media_contribution.name_of_series_program')}: {partOf.seriesName}
        </Typography>
      )}
      {partOf?.seriesPart && (
        <Typography>
          {t('registration.resource_type.media_contribution.name_of_issue_episode')}: {partOf.seriesPart}
        </Typography>
      )}
    </>
  );
};
