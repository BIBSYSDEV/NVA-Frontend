import React, { FC, useEffect, useState } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { ReferenceType } from '../../../types/references.types';
import { useTranslation } from 'react-i18next';

interface PublicationPageIdenfifiersProps {
  publication: Publication;
}

const PublicationPageIdentifiers: FC<PublicationPageIdenfifiersProps> = ({ publication }) => {
  const [isbn, setIsbn] = useState();
  const { t } = useTranslation('publication');

  useEffect(() => {
    publication.reference.type === ReferenceType.BOOK && setIsbn(publication.reference?.book?.isbn);
    publication.reference.type === ReferenceType.REPORT && setIsbn(publication.reference?.report?.isbn);
  }, [publication]);

  return (
    <>
      {isbn && (
        <LabelContentRowForPublicationPage label={t('references.isbn')}>{isbn}</LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageIdentifiers;
