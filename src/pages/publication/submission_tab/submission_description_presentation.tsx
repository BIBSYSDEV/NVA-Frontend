import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionDescriptionPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentLine label={t('description.abstract')}>{values.abstract}</LabelContentLine>
      <LabelContentLine label={t('description.description')}>{values.description}</LabelContentLine>
      <LabelContentLine label={t('description.npi_disciplines')}>
        {values.npiDiscipline.mainDiscipline}
        {values.npiDiscipline.title && `- ${values.npiDiscipline.title}`}
      </LabelContentLine>
      <LabelContentLine label={t('description.tags')}>{`${values.tags.join(', ')}`}</LabelContentLine>
      <LabelContentLine label={t('common:language')}>{t(`languages:${values.language}`)}</LabelContentLine>
      <LabelContentLine label={t('description.date_published')}>
        {values.publicationDate.year}
        {values.publicationDate.month && `-${values.publicationDate.month}`}
        {values.publicationDate.day && `-${values.publicationDate.day}`}
      </LabelContentLine>
      <LabelContentLine label={t('description.project_association')}>
        {values.projects.map(project => {
          return <SubmissionContentText>{project.titles?.[0]?.title}</SubmissionContentText>;
        })}
      </LabelContentLine>
    </>
  );
};

export default SubmissionDescriptionPresentation;
