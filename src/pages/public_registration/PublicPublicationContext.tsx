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
import { ArchitectureOutput, Competition, Venue } from '../../types/publication_types/artisticRegistration.types';

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
  outputs: (Venue | ArchitectureOutput)[];
  heading: string;
}

export const PublicArtisticOutput = ({ outputs, heading }: PublicArtisticOutputProps) => (
  <>
    <Typography variant="overline">{heading}</Typography>
    {outputs.map((output, index) => (
      <PublicOutputRow output={output} key={index} heading={heading} />
    ))}
  </>
);

interface PublicOutputRowProps {
  output: ArchitectureOutput | Venue;
  heading: string;
  showType?: boolean;
}

export const PublicOutputRow = ({ output, heading, showType = false }: PublicOutputRowProps) => {
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

        {output.type === 'Venue' && <PublicVenueDialogContent venue={output as Venue} />}
        {output.type === 'Competition' && <PublicCompetitionDialogContent competition={output as Competition} />}

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
      <Typography>{getPeriodString(venue.time)}</Typography>
    </DialogContent>
  );
};

const PublicCompetitionDialogContent = ({ competition }: { competition: Competition }) => {
  const { t } = useTranslation('registrations');
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
