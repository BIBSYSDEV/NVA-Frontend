import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography } from '@material-ui/core';
import { BookPublicationContext, ContextPublisher } from '../../types/publication_types/bookRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { Journal, Publisher } from '../../types/registration.types';
import { RegistrationSummary } from './RegistrationSummary';
import { useFetch } from '../../utils/hooks/useFetch';
import { ListSkeleton } from '../../components/ListSkeleton';

interface PublicJournalProps {
  publicationContext: JournalPublicationContext;
}

const getChannelRegisterJournalUrl = (id: string) =>
  `https://dbh.nsd.uib.no/publiseringskanaler/KanalTidsskriftInfo.action?id=${id}`;

const getChannelRegisterPublisherUrl = (id: string) =>
  `https://dbh.nsd.uib.no/publiseringskanaler/KanalForlagInfo.action?id=${id}`;

export const PublicJournal = ({ publicationContext }: PublicJournalProps) => {
  const { t } = useTranslation('registration');

  return publicationContext.id ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.journal')}
      </Typography>

      <PublicJournalContent id={publicationContext.id} errorMessage={t('feedback:error.get_journal')} />
    </>
  ) : null;
};

export const PublicPublisher = ({ publisher }: { publisher?: ContextPublisher }) => {
  const { t } = useTranslation('registration');

  const [fetchedPublisher, isLoadingPublisher] = useFetch<Publisher>({
    url: publisher?.id ?? '',
    errorMessage: t('feedback:error.get_publisher'),
  });

  return publisher ? (
    <>
      <Typography variant="overline" component="p">
        {t('common:publisher')}
      </Typography>

      {isLoadingPublisher ? (
        <ListSkeleton height={20} />
      ) : (
        fetchedPublisher && (
          <>
            <Typography>{fetchedPublisher.name}</Typography>
            <Typography
              component={Link}
              href={getChannelRegisterPublisherUrl(fetchedPublisher.identifier)}
              target="_blank">
              {t('public_page.find_in_channel_registry')}
            </Typography>
          </>
        )
      )}
    </>
  ) : null;
};

export const PublicPartOfContent = ({ partOf }: { partOf: string }) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.chapter.published_in')}
      </Typography>
      <RegistrationSummary id={partOf} />
    </>
  );
};

export const PublicSeries = ({
  publicationContext,
}: {
  publicationContext: BookPublicationContext | ReportPublicationContext | DegreePublicationContext;
}) => {
  const { t } = useTranslation('registration');
  const { series, seriesNumber } = publicationContext;

  return series?.id ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.series')}
      </Typography>
      <PublicJournalContent id={series.id} errorMessage={t('feedback:error.get_series')} />
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
  const [journal, isLoadingJournal] = useFetch<Journal>({
    url: id ?? '',
    errorMessage: t('feedback:error.get_journal'),
  });

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
            <Typography>
              {t('resource_type.level')}: {journal.level}
            </Typography>
            <Typography component={Link} href={getChannelRegisterJournalUrl(journal.identifier)} target="_blank">
              {t('public_page.find_in_channel_registry')}
            </Typography>
          </>
        )
      )}
    </>
  ) : null;
};
