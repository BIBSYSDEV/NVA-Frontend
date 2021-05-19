import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Typography } from '@material-ui/core';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { levelMap, RegistrationDate } from '../../types/registration.types';
import { displayDate } from '../../utils/date-helpers';
import RegistrationSummary from './RegistrationSummary';

interface PublicJournalContentProps {
  date: RegistrationDate;
  publicationContext: JournalPublicationContext;
}

export const PublicJournalContent = ({ date, publicationContext }: PublicJournalContentProps) => {
  const { t } = useTranslation('registration');
  const { onlineIssn, printIssn, title, url, level } = publicationContext;

  return title ? (
    <>
      {url ? (
        <Typography variant="subtitle2" component={Link} href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </Typography>
      ) : (
        <Typography variant="subtitle2" component="p">
          {title}
        </Typography>
      )}

      <Typography>{displayDate(date)}</Typography>

      {onlineIssn && (
        <Typography>
          {t('resource_type.issn')}: {[onlineIssn, printIssn].filter((issn) => issn).join(', ')}
        </Typography>
      )}
      <PublicLevelContent level={level} />
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
      <Typography variant="subtitle2" component="p">
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
      <Typography variant="h3">{t('resource_type.chapter.published_in')}</Typography>
      <RegistrationSummary id={linkedContext} />
    </>
  );
};

export const PublicSeriesContent = ({ seriesTitle }: { seriesTitle: string }) => {
  const { t } = useTranslation('registration');

  return seriesTitle ? (
    <>
      <Typography variant="subtitle2" component="p">
        {t('resource_type.series')}
      </Typography>
      <Typography>{seriesTitle}</Typography>
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
