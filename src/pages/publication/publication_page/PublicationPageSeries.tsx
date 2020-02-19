import React, { FC, useEffect, useState } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { useTranslation } from 'react-i18next';

interface PublicationPageSeriesProps {
  publication: Publication;
}

const PublicationPageSeries: FC<PublicationPageSeriesProps> = ({ publication }) => {
  const [series, setSeries] = useState();
  const { t } = useTranslation('publication');

  useEffect(() => {
    setSeries(publication.reference?.book?.series || publication.reference?.report?.series);
  }, [publication.reference]);

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
