import React, { FC } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { useTranslation } from 'react-i18next';

interface PublicationPageJournalProps {
  publication: Publication;
}

const PublicationPageJournal: FC<PublicationPageJournalProps> = ({ publication }) => {
  const { t } = useTranslation('publication');

  const { publisher } = publication.entityDescription;

  return (
    <>
      {publisher?.title && (
        <LabelContentRowForPublicationPage label={t('references.journal')}>
          {publisher.title}
        </LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageJournal;
