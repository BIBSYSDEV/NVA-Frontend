import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import { Typography } from '@material-ui/core';

const SubmissionBookPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Typography variant="h3">{t('references.book')}</Typography>
      <LabelContentLine label={t('common:type')}>{values.reference.book?.type}</LabelContentLine>
      <LabelContentLine label={t('references.publisher')}>{values.reference.book?.publisher?.title}</LabelContentLine>
      <LabelContentLine label={t('references.peer_reviewed')}>
        {values.reference.book?.peerReview ? t('references.is_peer_reviewed') : t('references.is_not_peer_reviewed')}
      </LabelContentLine>
      <LabelContentLine label={t('references.text_book')}>
        {values.reference.book?.textBook ? t('references.text_book_yes') : t('references.no')}
      </LabelContentLine>
      <LabelContentLine label={t('references.series')}>{values.reference.book?.series?.title}</LabelContentLine>
      <LabelContentLine label={t('references.issn')}>{values.reference.book?.isbn}</LabelContentLine>
      <LabelContentLine label={t('references.number_of_pages')}>
        {values.reference.book?.numberOfPages}
      </LabelContentLine>
    </>
  );
};

export default SubmissionBookPresentation;
