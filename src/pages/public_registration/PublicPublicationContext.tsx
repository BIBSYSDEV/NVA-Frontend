import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography } from '@material-ui/core';
import { BookPublicationContext, ContextPublisher } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { Journal, levelMap, Publisher } from '../../types/registration.types';
import { RegistrationSummary } from './RegistrationSummary';
import { useFetch } from '../../utils/hooks/useFetch';
import { ListSkeleton } from '../../components/ListSkeleton';

interface PublicJournalContentProps {
  publicationContext: JournalPublicationContext;
}

const getChannelRegisterUrl = (id: string) =>
  `https://dbh.nsd.uib.no/publiseringskanaler/KanalTidsskriftInfo.action?id=${id}`;

export const PublicJournalContent = ({ publicationContext }: PublicJournalContentProps) => {
  const { t } = useTranslation('registration');
  const [journal, isLoadingJournal] = useFetch<Journal>({
    url: publicationContext.id ?? '',
    errorMessage: t('feedback:error.get_journal'),
  });

  return publicationContext.id ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.journal')}
      </Typography>

      {isLoadingJournal ? (
        <ListSkeleton height={20} />
      ) : (
        journal && (
          <>
            {journal.website ? (
              <Typography component={Link} href={journal.website} target="_blank" rel="noopener noreferrer">
                {journal.name}
              </Typography>
            ) : (
              <Typography>{journal.name}</Typography>
            )}

            {journal.onlineIssn && (
              <Typography>
                {t('resource_type.issn')}: {[journal.onlineIssn, journal.printIssn].filter((issn) => issn).join(', ')}
              </Typography>
            )}
            <PublicLevelContent level={journal.level} />
          </>
        )
      )}
    </>
  ) : null;
};

export const PublicPublisherContent = ({ publisher }: { publisher?: ContextPublisher }) => {
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
        fetchedPublisher &&
        (fetchedPublisher.website ? (
          <Typography component={Link} href={fetchedPublisher.website} target="_blank" rel="noopener noreferrer">
            {fetchedPublisher.name}
          </Typography>
        ) : (
          <Typography>{fetchedPublisher.name}</Typography>
        ))
      )}
    </>
  ) : null;
};

export const PublicLinkedContextContent = ({
  publicationContext,
}: {
  publicationContext: ChapterPublicationContext;
}) => {
  const { t } = useTranslation('registration');
  const { linkedContext } = publicationContext;

  return (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.chapter.published_in')}
      </Typography>
      <RegistrationSummary id={linkedContext} />
    </>
  );
};

export const PublicSeriesContent = ({
  publicationContext,
}: {
  publicationContext: BookPublicationContext | ReportPublicationContext | DegreePublicationContext;
}) => {
  const { t } = useTranslation('registration');

  const { series, seriesNumber } = publicationContext;
  const [fetchedSeries, isLoadingSeries] = useFetch<Journal>({
    url: series?.id ?? '',
    errorMessage: t('feedback:error.get_series'),
  });

  return series?.id ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.series')}
      </Typography>
      {isLoadingSeries ? (
        <ListSkeleton />
      ) : (
        fetchedSeries && (
          <>
            <Typography>{fetchedSeries.name}</Typography>
            <Typography>
              {[
                fetchedSeries.printIssn ? `${t('resource_type.print_issn')}: ${fetchedSeries.printIssn}` : '',
                fetchedSeries.onlineIssn ? `${t('resource_type.online_issn')}: ${fetchedSeries.onlineIssn}` : '',
              ]
                .filter((issn) => issn)
                .join(', ')}
            </Typography>
            <Typography>
              {t('resource_type.level')}: {fetchedSeries.level}
            </Typography>
            <Typography component={Link} href={getChannelRegisterUrl(fetchedSeries.identifier)} target="_blank">
              {t('public_page.find_in_channel_registry')}
            </Typography>
            {seriesNumber && (
              <Typography>
                {t('resource_type.series_number')}: {seriesNumber}
              </Typography>
            )}
          </>
        )
      )}
    </>
  ) : null;
};

const PublicLevelContent = ({ level }: { level?: string | number | null }) => {
  const { t } = useTranslation('registration');
  const levelValue = level ? levelMap[level] : null;
  return levelValue ? (
    <Typography>
      {t('resource_type.level')}: {levelValue}
    </Typography>
  ) : null;
};
