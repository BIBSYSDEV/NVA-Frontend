import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { JournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { DegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { ReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import { BookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { PagesMonograph, PagesRange } from '../../types/publication_types/pages.types';
import i18n from '../../translations/i18n';

const getPageInterval = (pages: PagesRange) => {
  return pages.begin || pages.end
    ? `${i18n.t('registration:resource_type.pages')} ${pages.begin ?? '?'}-${pages.end ?? '?'}`
    : '';
};

export const PublicPublicationInstanceJournal = ({
  publicationInstance,
}: {
  publicationInstance: JournalPublicationInstance;
}) => {
  const { t } = useTranslation('registration');
  const { articleNumber, issue, pages, volume } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  const fieldTexts = [];
  if (volume) {
    fieldTexts.push(`${t('resource_type.volume')} ${volume}`);
  }
  if (issue) {
    fieldTexts.push(`${t('resource_type.issue')} ${issue}`);
  }
  if (pagesInterval) {
    fieldTexts.push(pagesInterval);
  }
  if (articleNumber) {
    fieldTexts.push(`${t('resource_type.article_number')} ${articleNumber}`);
  }

  return <Typography>{fieldTexts.join(', ')}</Typography>;
};

export const PublicPublicationInstanceBook = ({
  publicationInstance,
}: {
  publicationInstance: BookPublicationInstance;
}) => {
  const { t } = useTranslation('registration');
  const { pages, textbookContent } = publicationInstance;

  return (
    <>
      <PublicTotalPagesContent pages={pages} />
      {textbookContent && <Typography>{t('resource_type.text_book')}</Typography>}
    </>
  );
};

export const PublicPublicationInstanceDegree = ({
  publicationInstance,
}: {
  publicationInstance: DegreePublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};

export const PublicPublicationInstanceReport = ({
  publicationInstance,
}: {
  publicationInstance: ReportPublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};

export const PublicPublicationInstanceChapter = ({
  publicationInstance,
}: {
  publicationInstance: ChapterPublicationInstance;
}) => {
  const { pages } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  return <>{pagesInterval && <Typography>{pagesInterval}</Typography>}</>;
};

const PublicTotalPagesContent = ({ pages }: { pages: PagesMonograph | null }) => {
  const { t } = useTranslation('registration');

  return pages?.pages ? (
    <Typography>
      {t('resource_type.number_of_pages')}: {pages.pages}
    </Typography>
  ) : null;
};

export const PublicIsbnContent = ({ isbnList }: { isbnList?: string[] }) => {
  const { t } = useTranslation('registration');
  return isbnList ? (
    <Typography>
      {t('resource_type.isbn')}: {isbnList.join(', ')}
    </Typography>
  ) : null;
};
