import React, { FC } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { useTranslation } from 'react-i18next';

interface PublicationPageJournalProps {
  publication: Publication;
}

const PublicationPageJournal: FC<PublicationPageJournalProps> = ({ publication }) => {
  const { t } = useTranslation('publication');

  const { publicationContext } = publication.entityDescription.reference;

  return (
    <>
      {publicationContext && (
        <LabelContentRowForPublicationPage label={t('references.journal')}>
          {publicationContext.title}
        </LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageJournal;
