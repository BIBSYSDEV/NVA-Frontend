import React, { FC } from 'react';
import { Skeleton } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { Link } from '@material-ui/core';
import { JournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import LabelContentRow from '../../components/LabelContentRow';
import { DegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import { ReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';
import { PagesMonograph } from '../../types/registration.types';
import { JournalType } from '../../types/publicationFieldNames';
import useSearchRegistrations from '../../utils/hooks/useSearchRegistrations';

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
      {type === JournalType.CORRIGENDUM && <OriginalArticleInfo originalArticleId={corrigendumFor} />}
    </>
  );
};

const OriginalArticleInfo: FC<{ originalArticleId: string }> = ({ originalArticleId }) => {
  const { t } = useTranslation('registration');
  const [originalArticleSearch, isLoadingOriginalArticleSearch] = useSearchRegistrations(
    `identifier="${originalArticleId.split('/').pop()}"`
  );

  const originalArticle =
    originalArticleSearch && originalArticleSearch.hits.length === 1 ? originalArticleSearch.hits[0] : null;

  return (
    <LabelContentRow minimal label={`${t('references.original_article')}:`}>
      {isLoadingOriginalArticleSearch ? (
        <Skeleton width={400} />
      ) : (
        originalArticle && <Link href={`/registration/${originalArticle.id}/public`}>{originalArticle.title}</Link>
      )}
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
  const { t } = useTranslation('registration');

  return pages?.pages ? (
    <LabelContentRow minimal label={`${t('common:details')}:`}>
      {t('references.number_of_pages')}: {pages.pages}
    </LabelContentRow>
  ) : null;
};
