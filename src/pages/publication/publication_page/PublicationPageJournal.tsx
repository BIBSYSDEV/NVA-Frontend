import React, { FC, useEffect, useState } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from '../../../components/LabelContentRowForPublicationPage';
import { ReferenceType } from '../../../types/references.types';
import { useTranslation } from 'react-i18next';

interface PublicationPageJournalProps {
  publication: Publication;
}

const PublicationPageJournal: FC<PublicationPageJournalProps> = ({ publication }) => {
  const [publisher, setPublisher] = useState();
  const { t } = useTranslation('publication');

  useEffect(() => {
    publication.reference.type === ReferenceType.PUBLICATION_IN_JOURNAL &&
      setPublisher(publication.reference?.journalArticle?.publisher);
  }, []);

  return (
    <>
      {publisher && (
        <LabelContentRowForPublicationPage label={t('references.journal')}>
          {publisher.title}
        </LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageJournal;
