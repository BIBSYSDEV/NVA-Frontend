import React, { FC } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { useTranslation } from 'react-i18next';

interface PublicationPageJournalProps {
  publication: Publication;
}

const PublicationPageJournal: FC<PublicationPageJournalProps> = ({ publication }) => {
  const { t } = useTranslation('publication');

  return (
    <>
      {publication.reference?.journalArticle?.publisher && (
        <LabelContentRowForPublicationPage label={t('references.journal')}>
          {publication.reference?.journalArticle?.publisher}
        </LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageJournal;
