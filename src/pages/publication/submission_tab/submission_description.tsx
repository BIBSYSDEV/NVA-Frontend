import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';
import { getNpiDiscipline } from '../../../utils/npiDisciplines';
import { publicationLanguages } from '../../../types/language.types';

const SubmissionDescription: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  const {
    entityDescription: { mainTitle, abstract, description, npiSubjectHeading, tags, date, language },
    project,
  } = values;
  const npiDiscipline = getNpiDiscipline(npiSubjectHeading);
  const languageId =
    publicationLanguages.find((publicationLanguage) => publicationLanguage.value === language)?.id ?? '';

  return (
    <>
      <LabelContentRow label={t('common:title')}>{mainTitle}</LabelContentRow>
      <LabelContentRow label={t('description.abstract')}>{abstract}</LabelContentRow>
      <LabelContentRow label={t('description.description')}>{description}</LabelContentRow>
      <LabelContentRow label={t('description.npi_disciplines')}>
        {npiDiscipline ? `${npiDiscipline.mainDiscipline} - ${npiDiscipline.name}}` : null}
      </LabelContentRow>
      <LabelContentRow label={t('description.tags')}>{tags.join(', ')}</LabelContentRow>
      <LabelContentRow label={t('common:language')}>{t(`languages:${languageId}`)}</LabelContentRow>
      <LabelContentRow label={t('description.date_published')}>
        {date.year}
        {date.month && `-${date.month}`}
        {date.day && `-${date.day}`}
      </LabelContentRow>
      <LabelContentRow label={t('description.project_association')}>
        {project && <SubmissionContentText key={project.id}>{project.name}</SubmissionContentText>}
      </LabelContentRow>
    </>
  );
};

export default SubmissionDescription;
