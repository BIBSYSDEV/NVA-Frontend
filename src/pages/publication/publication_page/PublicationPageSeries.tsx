import React, { FC, useEffect, useState } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from '../../../components/LabelContentRowForPublicationPage';
import { ReferenceType } from '../../../types/references.types';
import { useTranslation } from 'react-i18next';

interface PublicationPageSeriesProps {
  publication: Publication;
}

const PublicationPageSeries: FC<PublicationPageSeriesProps> = ({ publication }) => {
  const [series, setSeries] = useState();
  const { t } = useTranslation('publication');

  useEffect(() => {
    publication.reference.type === ReferenceType.BOOK && setSeries(publication.reference?.book?.series);
    publication.reference.type === ReferenceType.REPORT && setSeries(publication.reference?.report?.series);
  }, [publication]);

  return (
    <>
      {series && (
        <LabelContentRowForPublicationPage label={t('references.series')}>
          {series.title}
        </LabelContentRowForPublicationPage>
      )}
    </>
  );
};

export default PublicationPageSeries;
