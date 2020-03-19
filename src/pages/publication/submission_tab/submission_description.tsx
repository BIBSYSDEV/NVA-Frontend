import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';
import { getNpiDiscipline } from '../../../utils/npiDisciplines';

const SubmissionDescription: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  const {
    mainTitle,
    abstract,
    description,
    npiSubjectHeading,
    tags,
    date,
    language,
    projects,
  } = values.entityDescription;

  const { name, mainDiscipline } = getNpiDiscipline(npiSubjectHeading);

  return (
    <>
      <LabelContentRow label={t('common:title')}>{mainTitle}</LabelContentRow>
      <LabelContentRow label={t('description.abstract')}>{abstract}</LabelContentRow>
      <LabelContentRow label={t('description.description')}>{description}</LabelContentRow>
      <LabelContentRow label={t('description.npi_disciplines')}>
        {mainDiscipline}
        {`- ${name}`}
      </LabelContentRow>
      <LabelContentRow label={t('description.tags')}>{tags.join(', ')}</LabelContentRow>
      <LabelContentRow label={t('common:language')}>{t(`languages:${language}`)}</LabelContentRow>
      <LabelContentRow label={t('description.date_published')}>
        {date.year}
        {date.month && `-${date.month}`}
        {date.day && `-${date.day}`}
      </LabelContentRow>
      <LabelContentRow label={t('description.project_association')}>
        {projects.map(project => (
          <SubmissionContentText key={project.cristinProjectId}>{project.titles?.[0]?.title}</SubmissionContentText>
        ))}
      </LabelContentRow>
    </>
  );
};

export default SubmissionDescription;
