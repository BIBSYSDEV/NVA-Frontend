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
import { hyphenate } from 'isbn3';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../api/commonApi';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { ListSkeleton } from '../../components/ListSkeleton';
import { NpiLevelTypography } from '../../components/NpiLevelTypography';
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
import { BookPublicationContext, Revision } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { ExhibitionBasic } from '../../types/publication_types/exhibitionContent.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import {
  MediaContributionPeriodicalPublicationContext,
  MediaContributionPublicationContext,
} from '../../types/publication_types/mediaContributionRegistration.types';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { ContextPublisher, Publisher, SerialPublication } from '../../types/registration.types';
import { getCountries } from '../../utils/countryHelpers';
import { toDateString } from '../../utils/date-helpers';
import { getIdentifierFromId, getPeriodString } from '../../utils/general-helpers';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { getIssnValuesString, getOutputName, hyphenateIsrc } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { OutputItem } from '../registration/resource_type_tab/sub_type_forms/artistic_types/OutputRow';
import { RegistrationSummary } from './RegistrationSummary';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext | MediaContributionPeriodicalPublicationContext;
}

export const PublicJournal = ({ publicationContext }: PublicJournalProps) => {
  const { t } = useTranslation();

  return publicationContext.id || publicationContext.title ? (
    <>
      <Typography variant="h3">{t('registration.resource_type.journal')}</Typography>
      {publicationContext.id ? (
        <PublicJournalContent id={publicationContext.id} errorMessage={t('feedback.error.get_journal')} />
      ) : (
        <>
          <Typography>{publicationContext.title}</Typography>
          <Typography>{getIssnValuesString(publicationContext)}</Typography>
        </>
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

  const publisherName = fetchedPublisher?.discontinued
    ? `${fetchedPublisher.name} (${t('common.discontinued')}: ${fetchedPublisher.discontinued})`
    : fetchedPublisher?.name;

  return publisher?.id || publisher?.name ? (
    <>
      <Typography variant="h3">{t('common.publisher')}</Typography>

      {isLoadingPublisher ? (
        <ListSkeleton height={20} />
      ) : fetchedPublisher ? (
        <>
          <Typography>{publisherName}</Typography>
          <NpiLevelTypography scientificValue={fetchedPublisher.scientificValue} channelId={fetchedPublisher.id} />
          {fetchedPublisher.sameAs && <ChannelRegisterLink uri={fetchedPublisher.sameAs} />}
        </>
      ) : (
        <Typography gutterBottom>{publisher.name}</Typography>
      )}
    </>
  ) : null;
};

export const PublicPublishedInContent = ({ id }: { id: string | null }) => {
  const { t } = useTranslation();

  return id ? (
    <Box sx={{ mb: '0.5rem' }}>
      <Typography variant="h3">{t('registration.resource_type.chapter.published_in')}</Typography>
      <RegistrationSummary id={id} />
    </Box>
  ) : null;
};

export const RevisionInformation = ({ revision }: { revision?: Revision | null }) => {
  const { t } = useTranslation();
  return Revision.Revised === revision ? <Typography>{t('registration.is_revision')}</Typography> : null;
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
      <Typography variant="h3" sx={{ mt: '0.5rem' }}>
        {t('registration.resource_type.series')}
      </Typography>
      {series.id ? (
        <PublicJournalContent id={series.id} errorMessage={t('feedback.error.get_series')} />
      ) : (
        <>
          <Typography>{series.title}</Typography>
          <Typography>{getIssnValuesString(series)}</Typography>
        </>
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
  id: string;
  errorMessage: string;
}

const PublicJournalContent = ({ id, errorMessage }: PublicJournalContentProps) => {
  const { t } = useTranslation();

  const journalQuery = useQuery({
    enabled: !!id,
    queryKey: ['channel', id],
    queryFn: () => fetchResource<SerialPublication>(id),
    meta: { errorMessage },
  });
  const journal = journalQuery.data;

  const journalName = journal?.discontinued
    ? `${journal.name} (${t('common.discontinued')}: ${journal.discontinued})`
    : journal?.name;

  return journalQuery.isPending ? (
    <ListSkeleton height={20} />
  ) : !journal ? null : (
    <>
      <Typography>{journalName}</Typography>
      <Typography>{getIssnValuesString(journal)}</Typography>
      <NpiLevelTypography scientificValue={journal.scientificValue} channelId={journal.id} />
      {journal.sameAs && <ChannelRegisterLink uri={journal.sameAs} />}
    </>
  );
};

const ChannelRegisterLink = ({ uri }: { uri: string }) => {
  const { t } = useTranslation();
  if (!uri) {
    return null;
  }
  return (
    <Link
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content' }}>
      {t('registration.public_page.find_in_channel_registry')}
      <OpenInNewIcon fontSize="small" />
    </Link>
  );
};

interface PublicPresentationProps {
  publicationContext: PresentationPublicationContext;
}

export const PublicPresentation = ({ publicationContext }: PublicPresentationProps) => {
  const { t, i18n } = useTranslation();
  const { type, time, place, name, agent } = publicationContext;
  const periodString = getPeriodString(time?.from, time?.to);

  return (
    <>
      <Typography variant="h3">{t(`registration.publication_types.${type}`)}</Typography>
      {name && (
        <Typography>
          {t('registration.resource_type.title_of_event')}: {name}
        </Typography>
      )}
      {agent?.name && (
        <Typography>
          {t('registration.resource_type.organizer')}: {agent.name}
        </Typography>
      )}
      {place?.name && (
        <Typography>
          {t('registration.resource_type.place_for_event')}: {place.name}
        </Typography>
      )}
      {place?.country && (
        <Typography>
          {t('common.country')}: {getCountries(i18n.language)[place.country]}
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
        <ErrorBoundary key={index}>
          <PublicOutputRow output={output} showType={showType} />
        </ErrorBoundary>
      ))}
    </>
  );
};

interface PublicOutputRowProps {
  output: OutputItem;
  showType: boolean;
}

const PublicOutputRow = ({ output, showType }: PublicOutputRowProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const exhibitionCatalogIdentifier =
    output.type === 'ExhibitionCatalog' && output.id ? getIdentifierFromId(output.id) : '';

  const exhibitionCatalogQuery = useFetchRegistration(exhibitionCatalogIdentifier);

  const nameString = exhibitionCatalogIdentifier
    ? exhibitionCatalogQuery.data?.entityDescription?.mainTitle
    : getOutputName(output);

  const rowString = showType
    ? `${nameString} (${t(`registration.resource_type.artistic.output_type.${output.type}` as any)})`
    : nameString;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Typography>{rowString?.trim() || <i>{t('common.unknown')}</i>}</Typography>
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
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${exhibitionBasic.type}`)}
      </Typography>
      <Typography variant="h3" gutterBottom>
        {t('registration.resource_type.exhibition_production.institution_name')}
      </Typography>
      <Typography sx={{ mb: '1rem' }}>{exhibitionBasic.organization.name || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('common.place')}
      </Typography>
      <Typography sx={{ mb: '1rem' }}>{exhibitionBasic.place?.name || '-'}</Typography>
      <Typography variant="h3" gutterBottom>
        {t('common.date')}
      </Typography>
      <Typography>{getPeriodString(exhibitionBasic.date?.from, exhibitionBasic.date?.to)}</Typography>
    </DialogContent>
  );
};

const PublicVenueDialogContent = ({ venue }: { venue: Venue }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{venue.place?.name ?? ''}</Typography>
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
      <Typography sx={{ mb: '1rem' }}>{competition.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.competition_rank')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{competition.description}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{toDateString(competition.date.value)}</Typography>
    </DialogContent>
  );
};

const PublicAwardDialogContent = ({ award }: { award: Award }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.competition_name')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{award.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_organizer')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{award.organizer}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography>{new Date(award.date.value).getFullYear()}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_ranking')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{award.ranking}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.award_other_type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{award.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicMentionDialogContent = ({ mention }: { mention: MentionInPublication }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.journal_book_medium')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{mention.title}</Typography>
      <Typography variant="h3">{t('registration.resource_type.issue')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{mention.issue}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{toDateString(mention.date.value)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.other_publisher_isbn_etc')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{mention.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionDialogContent = ({ exhibition }: { exhibition: Exhibition }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.exhibition_title')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{exhibition.name}</Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{exhibition.place?.name ?? ''}</Typography>
      <Typography variant="h3">{t('registration.resource_type.organizer')}</Typography>
      <Typography>{exhibition.organizer}</Typography>
      <Typography variant="h3">{t('common.other')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{exhibition.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicBroadcastDialogContent = ({ broadcast }: { broadcast: Broadcast }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${broadcast.type}`)}
      </Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{broadcast.publisher.name}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography>{toDateString(broadcast.date.value)}</Typography>
    </DialogContent>
  );
};

const PublicCinematicReleaseDialogContent = ({ cinematicRelease }: { cinematicRelease: CinematicRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${cinematicRelease.type}`)}
      </Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{cinematicRelease.place.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{toDateString(cinematicRelease.date.value)}</Typography>
    </DialogContent>
  );
};

const PublicOtherReleaseDialogContent = ({ otherRelease }: { otherRelease: OtherRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('registration.resource_type.artistic.other_release_description')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${otherRelease.type}`)}: {otherRelease.description}
      </Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{otherRelease.place.name}</Typography>
      {otherRelease.publisher.name && (
        <>
          <Typography variant="h3">{t('registration.resource_type.artistic.other_announcement_organizer')}</Typography>
          <Typography sx={{ mb: '1rem' }}>{otherRelease.publisher.name}</Typography>
        </>
      )}
      <Typography variant="h3">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{toDateString(otherRelease.date.value)}</Typography>
    </DialogContent>
  );
};

const PublicMusicScoreDialogContent = ({ musicScore }: { musicScore: MusicScore }) => {
  const { t } = useTranslation();
  const { type, ensemble, movements, extent, publisher, ismn } = musicScore;

  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_ensemble')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{ensemble}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_movements')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{movements}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.extent')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{extent}</Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{publisher.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_ismn')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{ismn?.formatted ?? ismn?.value ?? '-'}</Typography>
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
      <Typography sx={{ mb: '1rem' }}>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.media_type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {mediaType.type
          ? mediaType.type !== 'MusicMediaOther'
            ? t(`registration.resource_type.artistic.music_media_type.${mediaType.type}`)
            : mediaType.description
          : ''}
      </Typography>
      <Typography variant="h3">{t('common.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{publisher.name}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.catalogue_number')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{catalogueNumber ? catalogueNumber : '-'}</Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.music_score_isrc')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{isrc?.value ? hyphenateIsrc(isrc?.value) : '-'}</Typography>
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
      <Typography sx={{ mb: '1rem' }}>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{place?.name ?? '-'}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.concert_part_of_series')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{concertSeries ? t('common.yes') : t('common.no')} </Typography>
      {concertSeries && (
        <>
          <Typography variant="h3">{t('common.description')} </Typography>
          <Typography sx={{ mb: '1rem' }}>{concertSeries}</Typography>
        </>
      )}

      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {time?.type === 'Instant'
          ? toDateString(time.value)
          : time?.type === 'Period'
            ? getPeriodString(time.from, time.to)
            : '-'}
      </Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{extent}</Typography>

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
                <TableCell>{item.title ?? '-'}</TableCell>
                <TableCell>{item.composer ?? '-'}</TableCell>
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
      <Typography sx={{ mb: '1rem' }}>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.performance_type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{performanceType}</Typography>

      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{place?.name}</Typography>

      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{extent}</Typography>

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
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${literaryArtsMonograph.type}`)}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{literaryArtsMonograph.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{literaryArtsMonograph.publicationDate.year}</Typography>
      <Typography variant="h3">{t('registration.resource_type.isbn')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
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
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${webPublication.type}`)}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.web_link')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        <Link href={webPublication.id} target="_blank" rel="noopener noreferrer">
          {webPublication.id}
        </Link>
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{webPublication.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{webPublication.publicationDate.year}</Typography>
    </DialogContent>
  );
};

const PublicLiteraryArtsPerformanceDialogContent = ({ performance }: { performance: LiteraryArtsPerformance }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${performance.type}`)}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.type_work')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {performance.subtype.type
          ? performance.subtype.type === LiteraryArtsPerformanceSubtype.Other
            ? performance.subtype.description
            : t(`registration.resource_type.artistic.performance_types.${performance.subtype.type}`)
          : '-'}
      </Typography>
      <Typography variant="h3">{t('common.place')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{performance.place.name}</Typography>
      <Typography variant="h3">{t('common.date')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {toDateString(
          new Date(
            +performance.publicationDate.year,
            +performance.publicationDate.month,
            +performance.publicationDate.day
          )
        )}
      </Typography>
    </DialogContent>
  );
};

const PublicLiteraryArtsAudioVisualDialogContent = ({ audioVisual }: { audioVisual: LiteraryArtsAudioVisual }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="h3">{t('common.type')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {t(`registration.resource_type.artistic.output_type.${audioVisual.type}`)}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.type_work')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {audioVisual.subtype.type
          ? audioVisual.subtype.type === LiteraryArtsAudioVisualSubtype.Other
            ? audioVisual.subtype.description
            : t(`registration.resource_type.artistic.audio_video_type.${audioVisual.subtype.type}`)
          : '-'}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{audioVisual.publisher.name}</Typography>
      <Typography variant="h3">{t('common.year')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{audioVisual.publicationDate.year ?? '-'}</Typography>
      <Typography variant="h3">{t('registration.resource_type.isbn')}</Typography>
      <Typography sx={{ mb: '1rem' }}>
        {audioVisual.isbnList
          .filter((isbn) => isbn)
          .map((isbn) => hyphenate(isbn))
          .join(', ')}
      </Typography>
      <Typography variant="h3">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography sx={{ mb: '1rem' }}>{audioVisual.extent ?? '-'}</Typography>
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
