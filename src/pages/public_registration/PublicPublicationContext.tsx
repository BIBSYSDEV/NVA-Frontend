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
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';
import { BookPublicationContext, ContextPublisher } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { Journal, Publisher } from '../../types/registration.types';
import { RegistrationSummary } from './RegistrationSummary';
import { ListSkeleton } from '../../components/ListSkeleton';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';
import { getArtisticOutputName, getPeriodString } from '../../utils/registration-helpers';
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
} from '../../types/publication_types/artisticRegistration.types';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { MediaContributionPublicationContext } from '../../types/publication_types/mediaContributionRegistration';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext;
}

const channelRegisterBaseUrl = 'https://kanalregister.hkdir.no/publiseringskanaler';
export const getChannelRegisterJournalUrl = (id: string) =>
  `${channelRegisterBaseUrl}/KanalTidsskriftInfo.action?id=${id}`;
export const getChannelRegisterPublisherUrl = (id: string) =>
  `${channelRegisterBaseUrl}/KanalForlagInfo.action?id=${id}`;

export const PublicJournal = ({ publicationContext }: PublicJournalProps) => {
  const { t } = useTranslation('registration');

  return publicationContext.id || publicationContext.title ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.journal')}
      </Typography>
      {publicationContext.id ? (
        <PublicJournalContent id={publicationContext.id} errorMessage={t('feedback:error.get_journal')} />
      ) : (
        <Typography>{publicationContext.title}</Typography>
      )}
    </>
  ) : null;
};

export const PublicPublisher = ({ publisher }: { publisher?: ContextPublisher }) => {
  const { t } = useTranslation('registration');

  const [fetchedPublisher, isLoadingPublisher] = useFetchResource<Publisher>(
    publisher?.id ?? '',
    t('feedback:error.get_publisher')
  );

  return publisher?.id || publisher?.name ? (
    <>
      <Typography variant="overline" component="p">
        {t('common:publisher')}
      </Typography>

      {isLoadingPublisher ? (
        <ListSkeleton height={20} />
      ) : fetchedPublisher ? (
        <>
          <Typography>{fetchedPublisher.name}</Typography>
          {fetchedPublisher.level && (
            <Typography>
              {t('resource_type.level')}: {fetchedPublisher.level}
            </Typography>
          )}
          <Typography
            component={Link}
            href={getChannelRegisterPublisherUrl(fetchedPublisher.identifier)}
            target="_blank">
            {t('public_page.find_in_channel_registry')}
          </Typography>
        </>
      ) : (
        <Typography>{publisher.name}</Typography>
      )}
    </>
  ) : null;
};

export const PublicPartOfContent = ({ partOf }: { partOf: string | null }) => {
  const { t } = useTranslation('registration');

  return partOf ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.chapter.published_in')}
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
  const { t } = useTranslation('registration');
  const { series, seriesNumber } = publicationContext;

  return series?.id || series?.title ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.series')}
      </Typography>
      {series.id ? (
        <PublicJournalContent id={series.id} errorMessage={t('feedback:error.get_series')} />
      ) : (
        <Typography>{series.title}</Typography>
      )}
      {seriesNumber && (
        <Typography>
          {t('resource_type.series_number')}: {seriesNumber}
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
  const { t } = useTranslation('registration');
  const [journal, isLoadingJournal] = useFetchResource<Journal>(id ?? '', t('feedback:error.get_journal'));

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
                journal.printIssn ? `${t('resource_type.print_issn')}: ${journal.printIssn}` : '',
                journal.onlineIssn ? `${t('resource_type.online_issn')}: ${journal.onlineIssn}` : '',
              ]
                .filter((issn) => issn)
                .join(', ')}
            </Typography>
            {journal.level && (
              <Typography>
                {t('resource_type.level')}: {journal.level}
              </Typography>
            )}
            <Typography component={Link} href={getChannelRegisterJournalUrl(journal.identifier)} target="_blank">
              {t('public_page.find_in_channel_registry')}
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
  const { t } = useTranslation('registration');
  const { type, time, place, label, agent } = publicationContext;
  const periodString = getPeriodString(time);

  return (
    <>
      <Typography variant="overline">{t(`publicationTypes:${type}`)}</Typography>
      {label && <Typography>{label}</Typography>}
      {agent?.name && (
        <Typography>
          {t('resource_type.organizer')}: {agent.name}
        </Typography>
      )}
      {place?.label && (
        <Typography>
          {t('resource_type.place_for_event')}: {place.label}
        </Typography>
      )}
      {place?.country && (
        <Typography>
          {t('common:country')}: {place.country}
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
  const { t } = useTranslation('registration');
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const nameString = getArtisticOutputName(output);
  const rowString = showType ? `${nameString} (${t(`resource_type.artistic.output_type.${output.type}`)})` : nameString;

  return (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Typography>{rowString}</Typography>
      <Tooltip title={t<string>('common:show_details')}>
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
          ) : null}
        </ErrorBoundary>

        <DialogActions>
          <Button variant="outlined" onClick={toggleModal}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const PublicVenueDialogContent = ({ venue }: { venue: Venue }) => {
  const { t } = useTranslation('common');
  return (
    <DialogContent>
      <Typography variant="overline">{t('place')}</Typography>
      <Typography paragraph>{venue.place?.label ?? ''}</Typography>
      <Typography variant="overline">{t('date')}</Typography>
      <Typography>{getPeriodString(venue.date)}</Typography>
    </DialogContent>
  );
};

const PublicCompetitionDialogContent = ({ competition }: { competition: Competition }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{competition.name}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.competition_rank')}</Typography>
      <Typography paragraph>{competition.description}</Typography>
      <Typography variant="overline">{t('common:date')}</Typography>
      <Typography>{new Date(competition.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicAwardDialogContent = ({ award }: { award: Award }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('resource_type.artistic.competition_name')}</Typography>
      <Typography paragraph>{award.name}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.award_organizer')}</Typography>
      <Typography paragraph>{award.organizer}</Typography>
      <Typography variant="overline">{t('common:year')}</Typography>
      <Typography>{new Date(award.date.value).getFullYear()}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.award_ranking')}</Typography>
      <Typography paragraph>{award.ranking}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.award_other')}</Typography>
      <Typography paragraph>{award.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicMentionDialogContent = ({ mention }: { mention: MentionInPublication }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('resource_type.artistic.mention_title')}</Typography>
      <Typography paragraph>{mention.title}</Typography>
      <Typography variant="overline">{t('resource_type.issue')}</Typography>
      <Typography paragraph>{mention.issue}</Typography>
      <Typography variant="overline">{t('common:date')}</Typography>
      <Typography>{new Date(mention.date.value).toLocaleDateString()}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.mention_other')}</Typography>
      <Typography paragraph>{mention.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicExhibitionDialogContent = ({ exhibition }: { exhibition: Exhibition }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('resource_type.artistic.exhibition_title')}</Typography>
      <Typography paragraph>{exhibition.name}</Typography>
      <Typography variant="overline">{t('common:place')}</Typography>
      <Typography paragraph>{exhibition.place?.label ?? ''}</Typography>
      <Typography variant="overline">{t('resource_type.organizer')}</Typography>
      <Typography>{exhibition.organizer}</Typography>
      <Typography variant="overline">{t('common:other')}</Typography>
      <Typography paragraph>{exhibition.otherInformation}</Typography>
    </DialogContent>
  );
};

const PublicBroadcastDialogContent = ({ broadcast }: { broadcast: Broadcast }) => {
  const { t } = useTranslation('common');
  return (
    <DialogContent>
      <Typography variant="overline">{t('common:type')}</Typography>
      <Typography paragraph>{t(`registration:resource_type.artistic.output_type.${broadcast.type}`)}</Typography>
      <Typography variant="overline">{t('publisher')}</Typography>
      <Typography paragraph>{broadcast.publisher.name}</Typography>
      <Typography variant="overline">{t('date')}</Typography>
      <Typography>{new Date(broadcast.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicCinematicReleaseDialogContent = ({ cinematicRelease }: { cinematicRelease: CinematicRelease }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('common:type')}</Typography>
      <Typography paragraph>{t(`resource_type.artistic.output_type.${cinematicRelease.type}`)}</Typography>
      <Typography variant="overline">{t('common:place')}</Typography>
      <Typography paragraph>{cinematicRelease.place.label}</Typography>
      <Typography variant="overline">{t('resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(cinematicRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

const PublicOtherReleaseDialogContent = ({ otherRelease }: { otherRelease: OtherRelease }) => {
  const { t } = useTranslation('registration');
  return (
    <DialogContent>
      <Typography variant="overline">{t('resource_type.artistic.other_release_description')}</Typography>
      <Typography paragraph>
        {t(`resource_type.artistic.output_type.${otherRelease.type}`)}: {otherRelease.description}
      </Typography>
      <Typography variant="overline">{t('common:place')}</Typography>
      <Typography paragraph>{otherRelease.place.label}</Typography>
      {otherRelease.publisher.name && (
        <>
          <Typography variant="overline">{t('resource_type.artistic.other_announcement_organizer')}</Typography>
          <Typography paragraph>{otherRelease.publisher.name}</Typography>
        </>
      )}
      <Typography variant="overline">{t('resource_type.artistic.premiere_date')}</Typography>
      <Typography>{new Date(otherRelease.date.value).toLocaleDateString()}</Typography>
    </DialogContent>
  );
};

interface PublicMediaContributionProps {
  publicationContext: MediaContributionPublicationContext;
}

export const PublicPublicationContextMediaContribution = ({ publicationContext }: PublicMediaContributionProps) => {
  const { t } = useTranslation('registration');
  const { medium, format, disseminationChannel, partOf } = publicationContext;

  return (
    <>
      {medium && (
        <Typography>
          {t('resource_type.media_contribution.medium')}: {t(`resource_type.media_contribution.medium_types.${medium}`)}
        </Typography>
      )}
      {format && (
        <Typography>
          {t('resource_type.media_contribution.format')}: {t(`resource_type.media_contribution.format_types.${format}`)}
        </Typography>
      )}
      {disseminationChannel && (
        <Typography>
          {t('resource_type.media_contribution.channel')}: {disseminationChannel}
        </Typography>
      )}
      {partOf?.series && (
        <Typography>
          {t('resource_type.media_contribution.containerName')}: {partOf.series}
        </Typography>
      )}
      {partOf?.seriesPart && (
        <Typography>
          {t('resource_type.media_contribution.containerSubname')}: {partOf.seriesPart}
        </Typography>
      )}
    </>
  );
};
