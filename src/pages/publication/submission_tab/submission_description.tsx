import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionDescription: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('description.abstract')}>{values.abstract}</LabelContentRow>
      <LabelContentRow label={t('description.description')}>{values.description}</LabelContentRow>
      <LabelContentRow label={t('description.npi_disciplines')}>
        {values.npiDiscipline.mainDiscipline}
        {values.npiDiscipline.title && `- ${values.npiDiscipline.title}`}
      </LabelContentRow>
      <LabelContentRow label={t('description.tags')}>{`${values.tags.join(', ')}`}</LabelContentRow>
      <LabelContentRow label={t('common:language')}>{t(`languages:${values.language}`)}</LabelContentRow>
      <LabelContentRow label={t('description.date_published')}>
        {values.publicationDate.year}
        {values.publicationDate.month && `-${values.publicationDate.month}`}
        {values.publicationDate.day && `-${values.publicationDate.day}`}
      </LabelContentRow>
      <LabelContentRow label={t('description.project_association')}>
        {values.projects.map(project => (
          <SubmissionContentText key={project.cristinProjectId}>{project.titles?.[0]?.title}</SubmissionContentText>
        ))}
      </LabelContentRow>
    </>
  );
};

export default SubmissionDescription;
