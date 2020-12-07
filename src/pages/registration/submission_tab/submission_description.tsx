import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Typography } from '@material-ui/core';
import { Registration } from '../../../types/registration.types';
import { getNpiDiscipline } from '../../../utils/npiDisciplines';
import { registrationLanguages } from '../../../types/language.types';
import { displayDate } from '../../../utils/date-helpers';

const SubmissionDescription: React.FC = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<Registration>();

  const {
    entityDescription: { mainTitle, abstract, description, npiSubjectHeading, tags, date, language },
    projects,
  } = values;
  const npiDiscipline = getNpiDiscipline(npiSubjectHeading);
  const languageId =
    registrationLanguages.find((publicationLanguage) => publicationLanguage.value === language)?.id ?? '';

  return (
    <>
      <LabelContentRow label={t('common:title')}>{mainTitle}</LabelContentRow>
      <LabelContentRow label={t('description.abstract')}>{abstract}</LabelContentRow>
      <LabelContentRow label={t('description.description')}>{description}</LabelContentRow>
      <LabelContentRow label={t('description.npi_disciplines')}>
        {npiDiscipline ? `${npiDiscipline.mainDiscipline} - ${npiDiscipline.name}` : null}
      </LabelContentRow>
      <LabelContentRow label={t('description.keywords')}>{tags.join(', ')}</LabelContentRow>
      <LabelContentRow label={t('common:language')}>{t(`languages:${languageId}`)}</LabelContentRow>
      <LabelContentRow label={t('description.date_published')}>{displayDate(date)}</LabelContentRow>
      <LabelContentRow label={`${t('description.project_association')}:`}>
        {projects && projects.map((project) => <Typography key={project.id}>{project.name}</Typography>)}
      </LabelContentRow>
    </>
  );
};

export default SubmissionDescription;
