import React, { FC } from 'react';
import LabelContentRow from '../../../components/LabelContentRow';
import { JournalPublicationInstance } from '../../../types/publication_types/journalPublication.types';
import { useTranslation } from 'react-i18next';
import { DegreePublicationInstance } from '../../../types/publication_types/degreePublication.types';
import { ReportPublicationInstance } from '../../../types/publication_types/reportPublication.types';
import { PagesMonograph } from '../../../types/publication.types';

export const PublicPublicationInstanceJournal: FC<{ publicationInstance: JournalPublicationInstance }> = ({
  publicationInstance,
}) => {
  const { t } = useTranslation('publication');
  const { articleNumber, issue, pages, volume } = publicationInstance;

  return (
    <LabelContentRow minimal label={`${t('common:details')}:`}>
      {volume && `${t('references.volume')} ${volume}`}
      {issue && `, ${t('references.issue')} ${issue}`}
      {pages?.begin && pages?.end && `, ${t('references.pages')} ${pages!.begin}-${pages!.end}`}
      {articleNumber && `, ${t('references.article_number')} ${articleNumber}`}
    </LabelContentRow>
  );
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

const DisplayPages: FC<{ pages: PagesMonograph | null }> = ({ pages }) => {
  const { t } = useTranslation('publication');

  return pages?.pages ? (
    <LabelContentRow minimal label={`${t('common:details')}:`}>
      `${t('references.pages')} ${pages.pages}`
    </LabelContentRow>
  ) : null;
};
