import LabelContentRow from '../../../components/LabelContentRow';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { BookEntityDescription } from '../../../types/publication_types/book.publication.types';

const SubmissionBook: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as BookEntityDescription;

  return (
    <>
      <LabelContentRow label={t('references.subtype')}>
        {publicationInstance.type && t(`publicationTypes:${publicationInstance.type}`)}
      </LabelContentRow>
      <LabelContentRow label={t('common:publisher')}>{publicationContext?.publisher}</LabelContentRow>
      <LabelContentRow label={t('references.peer_reviewed')}>
        {publicationInstance.peerReviewed ? t('common:yes') : t('common:no')}
      </LabelContentRow>
      {/* TODO <LabelContentRow label={t('references.text_book')}>{textBook ? t('common:yes') : t('common:no')}</LabelContentRow> */}
      {/* TODO <LabelContentRow label={t('references.series')}>{series.title}</LabelContentRow> */}
      {/* TODO <LabelContentRow label={t('references.issn')}>{isbn}</LabelContentRow> */}
      {/* TODO <LabelContentRow label={t('references.number_of_pages')}>{numberOfPages}</LabelContentRow> */}
    </>
  );
};

export default SubmissionBook;
