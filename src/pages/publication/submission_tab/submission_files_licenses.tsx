import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import FormCardLabel from '../../../components/FormCard/FormCardLabel';

const SubmissionFilesAndLicenses: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <FormCardLabel>{t('files_and_license.files')}</FormCardLabel>
      {values.files.map(file => (
        <React.Fragment key={file.id}>
          <hr />
          <LabelContentRow label={t('files_and_license.title')}>{file.name}</LabelContentRow>
          <LabelContentRow label={t('files_and_license.license')}>{file.license}</LabelContentRow>
          <LabelContentRow label={t('files_and_license.embargo_date')}>
            {file.embargoDate?.toLocaleDateString()}
          </LabelContentRow>
          <LabelContentRow label={t('files_and_license.administrative_contract')}>
            {file.administrativeContract ? t('common:yes') : t('common:no')}
          </LabelContentRow>
          <LabelContentRow label={t('files_and_license.published_version')}>
            {file.isPublished ? t('common:yes') : t('common:no')}v
          </LabelContentRow>
        </React.Fragment>
      ))}
    </>
  );
};

export default SubmissionFilesAndLicenses;
