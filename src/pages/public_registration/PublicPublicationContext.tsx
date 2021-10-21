import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography } from '@mui/material';
import { BookPublicationContext, ContextPublisher } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { Journal, Publisher } from '../../types/registration.types';
import { RegistrationSummary } from './RegistrationSummary';
import { ListSkeleton } from '../../components/ListSkeleton';
import { useFetchResource } from '../../utils/hooks/useFetchResource';
import { PresentationPublicationContext } from '../../types/publication_types/presentationRegistration.types';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext;
}

const channelRegisterBaseUrl = 'https://kanalregister.hkdir.no/publiseringskanaler';
const getChannelRegisterJournalUrl = (id: string) => `${channelRegisterBaseUrl}/KanalTidsskriftInfo.action?id=${id}`;
const getChannelRegisterPublisherUrl = (id: string) => `${channelRegisterBaseUrl}/KanalForlagInfo.action?id=${id}`;

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
  const fromDate = publicationContext.time?.from ? new Date(publicationContext.time.from).toLocaleDateString() : '';
  const toDate = publicationContext.time?.to ? new Date(publicationContext.time.to).toLocaleDateString() : '';

  return (
    <>
      <Typography variant="overline">{t('publicationTypes:Event')}</Typography>
      <Typography>{publicationContext.label}</Typography>
      <Typography>{publicationContext.place.label}</Typography>
      <Typography>{publicationContext.place.country}</Typography>
      <Typography>{fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`}</Typography>
    </>
  );
};
