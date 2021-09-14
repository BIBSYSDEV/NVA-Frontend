import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress, Link, Typography } from '@material-ui/core';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { Journal, levelMap, RegistrationDate } from '../../types/registration.types';
import { displayDate } from '../../utils/date-helpers';
import { RegistrationSummary } from './RegistrationSummary';
import { useFetch } from '../../utils/hooks/useFetch';
import { ListSkeleton } from '../../components/ListSkeleton';

interface PublicJournalContentProps {
  date: RegistrationDate;
  publicationContext: JournalPublicationContext;
}

const getChannelRegisterUrl = (id: string) =>
  `https://dbh.nsd.uib.no/publiseringskanaler/KanalTidsskriftInfo.action?id=${id}`;

export const PublicJournalContent = ({ date, publicationContext }: PublicJournalContentProps) => {
  const { t } = useTranslation('registration');
  const [journal, isLoadingJournal] = useFetch<Journal>({
    url: publicationContext.id ?? '',
    errorMessage: t('feedback:error.get_series'),
  });

  return publicationContext.id ? (
    <>
      <Typography variant="overline" component="p">
        {t('resource_type.journal')}
      </Typography>

      {isLoadingJournal ? (
        <CircularProgress />
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

            <Typography>{displayDate(date)}</Typography>

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

export const PublicPublisherContent = ({
  publicationContext,
}: {
  publicationContext: Partial<BookPublicationContext & DegreePublicationContext & ReportPublicationContext>;
}) => {
  const { t } = useTranslation('registration');
  const { publisher, url, level } = publicationContext;

  return publisher ? (
    <>
      <Typography variant="overline" component="p">
        {t('common:publisher')}
      </Typography>
      {url ? (
        <Typography component={Link} href={url} target="_blank" rel="noopener noreferrer">
          {publisher}
        </Typography>
      ) : (
        <Typography>{publisher}</Typography>
      )}
      <PublicLevelContent level={level} />
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
