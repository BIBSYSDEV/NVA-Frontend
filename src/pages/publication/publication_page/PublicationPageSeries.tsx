import React, { FC } from 'react';
import { Publication } from '../../../types/publication.types';
import LabelContentRowForPublicationPage from './LabelContentRowForPublicationPage';
import { useTranslation } from 'react-i18next';

interface PublicationPageSeriesProps {
  publication: Publication;
}

const PublicationPageSeries: FC<PublicationPageSeriesProps> = ({ publication }) => {
  const { t } = useTranslation('publication');

  const { series } = publication.entityDescription;
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
