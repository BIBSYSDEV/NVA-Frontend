import { useTranslation } from 'react-i18next';
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Tooltip,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import { visuallyHidden } from '@mui/utils';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { ContextPublisher, Journal, Publisher } from '../../types/registration.types';
import { RegistrationSummary } from './RegistrationSummary';
import { ListSkeleton } from '../../components/ListSkeleton';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import { getArtisticOutputName, hyphenateIsrc } from '../../utils/registration-helpers';
import {
  Award,
  Broadcast,
  Competition,
  Exhibition,
  MentionInPublication,
  ArtisticOutputItem,
  Venue,
  CinematicRelease,
  OtherRelease,
  MusicScore,
  AudioVisualPublication,
  Concert,
  OtherMusicPerformance,
  LiteraryArtsMonograph,
} from '../../types/publication_types/artisticRegistration.types';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { MediaContributionPublicationContext } from '../../types/publication_types/mediaContributionRegistration';
import { NpiLevelTypography } from '../../components/NpiLevelTypography';
import { getPeriodString } from '../../utils/general-helpers';
import { hyphenate } from 'isbn-utils';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext;
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
      <Typography variant="overline" component="p">
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
      <Typography variant="overline" component="p">
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

export const PublicPartOfContent = ({ partOf }: { partOf: string | null }) => {
  const { t } = useTranslation();

  return partOf ? (
    <>
      <Typography variant="overline" component="p">
        {t('registration.resource_type.chapter.published_in')}
      </Typography>
      <RegistrationSummary id={partOf} />
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
      <Typography variant="overline" component="p">
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

const PublicJournalContent = ({ id }: PublicJournalContentProps) => {
  const { t } = useTranslation();
  const [journal, isLoadingJournal] = useFetchResource<Journal>(id ?? '', t('feedback.error.get_journal'));

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
  const periodString = getPeriodString(time);

  return (
    <>
      <Typography variant="overline">{t(`registration.publication_types.${type}`)}</Typography>
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

interface PublicArtisticOutputProps {
  outputs: ArtisticOutputItem[];
  heading: string;
  showType?: boolean;
}

export const PublicArtisticOutput = ({ outputs, heading, showType = false }: PublicArtisticOutputProps) => (
  <>
    <Typography variant="overline">{heading}</Typography>
    {outputs.map((output, index) => (
      <PublicOutputRow key={index} output={output} heading={heading} showType={showType} />
    ))}
  </>
);

interface PublicOutputRowProps {
  output: ArtisticOutputItem;
  heading: string;
  showType: boolean;
}

const PublicOutputRow = ({ output, heading, showType }: PublicOutputRowProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const nameString = getArtisticOutputName(output);
  const rowString = showType
    ? `${nameString} (${t(`registration.resource_type.artistic.output_type.${output.type}` as any)})`
    : nameString;

  return (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Typography>{rowString}</Typography>
      <Tooltip title={t('common.show_details')}>
        <IconButton size="small" color="primary" onClick={toggleModal}>
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog open={openModal} onClose={toggleModal} fullWidth>
        <DialogTitle>{heading}</DialogTitle>
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

const PublicVenueDialogContent = ({ venue }: { venue: Venue }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{venue.place?.label ?? ''}</Typography>
      <Typography variant="overline">{t('common.date')}</Typography>
      <Typography>{getPeriodString(venue.date)}</Typography>
    </DialogContent>
  );
};

const PublicCompetitionDialogContent = ({ competition }: { competition: Competition }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('registration.resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{competition.name}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.competition_rank')}</Typography>
      <Typography paragraph>{competition.description}</Typography>
      <Typography variant="overline">{t('common.date')}</Typography>
      <Typography>{new Date(competition.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicAwardDialogContent = ({ award }: { award: Award }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('registration.resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{award.name}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.award_organizer')}</Typography>
      <Typography paragraph>{award.organizer}</Typography>
      <Typography variant="overline">{t('common.year')}</Typography>
      <Typography>{new Date(award.date.value).getFullYear()}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.award_ranking')}</Typography>
      <Typography paragraph>{award.ranking}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.award_other')}</Typography>
      <Typography paragraph>{award.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicMentionDialogContent = ({ mention }: { mention: MentionInPublication }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('registration.resource_type.artistic.mention_title')}</Typography>
      <Typography paragraph>{mention.title}</Typography>
      <Typography variant="overline">{t('registration.resource_type.issue')}</Typography>
      <Typography paragraph>{mention.issue}</Typography>
      <Typography variant="overline">{t('common.date')}</Typography>
      <Typography>{new Date(mention.date.value).toLocaleDateString()}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.mention_other')}</Typography>
      <Typography paragraph>{mention.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionDialogContent = ({ exhibition }: { exhibition: Exhibition }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('registration.resource_type.artistic.exhibition_title')}</Typography>
      <Typography paragraph>{exhibition.name}</Typography>
      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{exhibition.place?.label ?? ''}</Typography>
      <Typography variant="overline">{t('registration.resource_type.organizer')}</Typography>
      <Typography>{exhibition.organizer}</Typography>
      <Typography variant="overline">{t('common.other')}</Typography>
      <Typography paragraph>{exhibition.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicBroadcastDialogContent = ({ broadcast }: { broadcast: Broadcast }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${broadcast.type}`)}</Typography>
      <Typography variant="overline">{t('common.publisher')}</Typography>
      <Typography paragraph>{broadcast.publisher.name}</Typography>
      <Typography variant="overline">{t('common.date')}</Typography>
      <Typography>{new Date(broadcast.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicCinematicReleaseDialogContent = ({ cinematicRelease }: { cinematicRelease: CinematicRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${cinematicRelease.type}`)}</Typography>
      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{cinematicRelease.place.label}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(cinematicRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicOtherReleaseDialogContent = ({ otherRelease }: { otherRelease: OtherRelease }) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <Typography variant="overline">{t('registration.resource_type.artistic.other_release_description')}</Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${otherRelease.type}`)}: {otherRelease.description}
      </Typography>
      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{otherRelease.place.label}</Typography>
      {otherRelease.publisher.name && (
        <>
          <Typography variant="overline">
            {t('registration.resource_type.artistic.other_announcement_organizer')}
          </Typography>
          <Typography paragraph>{otherRelease.publisher.name}</Typography>
        </>
      )}
      <Typography variant="overline">{t('registration.resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(otherRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicMusicScoreDialogContent = ({ musicScore }: { musicScore: MusicScore }) => {
  const { t } = useTranslation();
  const { type, ensemble, movements, extent, publisher, ismn, isrc } = musicScore;

  return (
    <DialogContent>
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.music_score_ensemble')}</Typography>
      <Typography paragraph>{ensemble}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.music_score_movements')}</Typography>
      <Typography paragraph>{movements}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.extent')}</Typography>
      <Typography paragraph>{extent}</Typography>
      <Typography variant="overline">{t('common.publisher')}</Typography>
      <Typography paragraph>{publisher.name}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.music_score_ismn')}</Typography>
      <Typography paragraph>{ismn.formatted ?? ismn.value}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.music_score_isrc')}</Typography>
      <Typography paragraph>{hyphenateIsrc(isrc.value)}</Typography>
    </DialogContent>
  );
};

const PublicAudioVisualPublicationDialogContent = ({
  audioVisualPublication,
}: {
  audioVisualPublication: AudioVisualPublication;
}) => {
  const { t } = useTranslation();
  const { type, mediaType, publisher, catalogueNumber, trackList } = audioVisualPublication;

  return (
    <DialogContent>
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.media_type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.music_media_type.${mediaType}` as any)}</Typography>
      <Typography variant="overline">{t('common.publisher')}</Typography>
      <Typography paragraph>{publisher}</Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.catalogue_number')}</Typography>
      <Typography paragraph>{catalogueNumber}</Typography>
      <Typography variant="overline" id="tracks-heading">
        {t('registration.resource_type.artistic.content_track')}
      </Typography>

      <TableContainer>
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
  const { type, place, time, extent, concertProgramme, partOfSeries } = concert;

  return (
    <DialogContent>
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{place.label}</Typography>

      <Typography variant="overline">{t('registration.resource_type.artistic.concert_part_of_series')}</Typography>
      <Typography paragraph>{partOfSeries ? t('common.yes') : t('common.no')}</Typography>

      <Typography variant="overline">{t('common.date')}</Typography>
      {time.type === 'Instant' ? (
        <Typography paragraph>{new Date(time.value).toLocaleDateString()}</Typography>
      ) : (
        <Typography paragraph>{getPeriodString(time)}</Typography>
      )}

      <Typography variant="overline">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography paragraph>{extent}</Typography>

      <Typography variant="overline" id="program-heading">
        {t('registration.resource_type.artistic.concert_program')}
      </Typography>
      <TableContainer>
        <Table aria-labelledby="program-heading">
          <caption style={visuallyHidden}>
            {t('registration.resource_type.artistic.concert_program_table_caption')}
          </caption>
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
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>{t(`registration.resource_type.artistic.output_type.${type}`)}</Typography>

      <Typography variant="overline">{t('registration.resource_type.artistic.performance_type')}</Typography>
      <Typography paragraph>{performanceType}</Typography>

      <Typography variant="overline">{t('common.place')}</Typography>
      <Typography paragraph>{place.label}</Typography>

      <Typography variant="overline">{t('registration.resource_type.artistic.extent_in_minutes')}</Typography>
      <Typography paragraph>{extent}</Typography>

      <Typography variant="overline" id="works-heading">
        {t('registration.resource_type.artistic.musical_works')}
      </Typography>
      <TableContainer>
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
      <Typography variant="overline">{t('common.type')}</Typography>
      <Typography paragraph>
        {t(`registration.resource_type.artistic.output_type.${literaryArtsMonograph.type}`)}
      </Typography>
      <Typography variant="overline">{t('registration.resource_type.artistic.publisher')}</Typography>
      <Typography paragraph>{literaryArtsMonograph.publisher.name}</Typography>
      <Typography variant="overline">{t('common.year')}</Typography>
      <Typography paragraph>{literaryArtsMonograph.publicationDate.year}</Typography>
      <Typography variant="overline">{t('registration.resource_type.isbn')}</Typography>
      <Typography paragraph>{hyphenate(literaryArtsMonograph.isbn)}</Typography>
      <Typography variant="overline">{t('registration.resource_type.number_of_pages')}</Typography>
      <Typography>{literaryArtsMonograph.pages.pages}</Typography>
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
      {medium && (
        <Typography>
          {t('registration.resource_type.media_contribution.medium')}:{' '}
          {t(`registration.resource_type.media_contribution.medium_types.${medium}`)}
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
      {partOf?.series && (
        <Typography>
          {t('registration.resource_type.media_contribution.name_of_series_program')}: {partOf.series}
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
