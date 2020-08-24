import React, { FC } from 'react';
import LabelContentRow from '../../../components/LabelContentRow';
import { JournalPublicationInstance } from '../../../types/publication_types/journalPublication.types';
import { useTranslation } from 'react-i18next';

export const PublicPublicationInstanceJournal: FC<{ publicationInstance: JournalPublicationInstance }> = ({
  publicationInstance,
}) => {
  const { t } = useTranslation('publication');
  return (
    <LabelContentRow minimal label={`${t('common:details')}:`}>
      {publicationInstance.volume && `${t('references.volume')} ${publicationInstance.volume}`}
      {publicationInstance.issue && `, ${t('references.issue')} ${publicationInstance.issue}`}
      {publicationInstance.pages?.begin &&
        publicationInstance.pages?.end &&
        `, ${t('references.pages')} ${publicationInstance.pages!.begin}-${publicationInstance.pages!.end}`}
      {publicationInstance.articleNumber && `, ${t('references.article_number')} ${publicationInstance.articleNumber}`}
    </LabelContentRow>
  );
};
