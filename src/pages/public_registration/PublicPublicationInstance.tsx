import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { JournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import LabelContentRow from '../../components/LabelContentRow';
import { DegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { ReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import { PagesMonograph } from '../../types/registration.types';
import { JournalType } from '../../types/publicationFieldNames';
import { BookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import RegistrationSummary from './RegistrationSummary';

export const PublicPublicationInstanceJournal: FC<{ publicationInstance: JournalPublicationInstance }> = ({
  publicationInstance,
}) => {
  const { t } = useTranslation('registration');
  const { type, articleNumber, issue, pages, volume, corrigendumFor } = publicationInstance;

  const fieldTexts = [];
  if (volume) {
    fieldTexts.push(`${t('references.volume')} ${volume}`);
  }
  if (issue) {
    fieldTexts.push(`${t('references.issue')} ${issue}`);
  }
  if (pages.begin || pages.end) {
    fieldTexts.push(`${t('references.pages')} ${pages.begin ?? '?'}-${pages.end ?? '?'}`);
  }
  if (articleNumber) {
    fieldTexts.push(`${t('references.article_number')} ${articleNumber}`);
  }

  return (
    <>
      <LabelContentRow minimal label={`${t('common:details')}:`}>
        {fieldTexts.join(', ')}
      </LabelContentRow>
      {type === JournalType.CORRIGENDUM && (
        <LabelContentRow minimal label={`${t('references.original_article')}:`}>
          <RegistrationSummary id={corrigendumFor} />
        </LabelContentRow>
      )}
    </>
  );
};

export const PublicPublicationInstanceBook: FC<{ publicationInstance: BookPublicationInstance }> = ({
  publicationInstance,
}) => {
  const { pages } = publicationInstance;

  return <DisplayPages pages={pages} />;
};

export const PublicPublicationInstanceDegree: FC<{ publicationInstance: DegreePublicationInstance }> = ({
  publicationInstance,
}) => {
  const { pages } = publicationInstance;

  return <DisplayPages pages={pages} />;
};

export const PublicPublicationInstanceReport: FC<{ publicationInstance: ReportPublicationInstance }> = ({
  publicationInstance,
}) => {
  const { pages } = publicationInstance;

  return <DisplayPages pages={pages} />;
};

export const PublicPublicationInstanceChapter = ({
  publicationInstance,
}: {
  publicationInstance: ChapterPublicationInstance;
}) => {
  const { t } = useTranslation('registration');
  const { pages, peerReviewed } = publicationInstance;

  return (
    <>
      <LabelContentRow minimal label={`${t('references.pages')}:`}>
        {pages.begin ?? '?'}-{pages.end ?? '?'}
      </LabelContentRow>
      <LabelContentRow minimal label={`${t('references.peer_reviewed')}:`}>
        {peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
    </>
  );
};

const DisplayPages: FC<{ pages: PagesMonograph | null }> = ({ pages }) => {
  const { t } = useTranslation('registration');

  return pages?.pages ? (
    <LabelContentRow minimal label={`${t('common:details')}:`}>
      {t('references.number_of_pages')}: {pages.pages}
    </LabelContentRow>
  ) : null;
};
