import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionFilesAndLicenses: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentRow label={t('files_and_license.files')}>
        {values.files.map(file => (
          <SubmissionContentText>
            {file.name}({file.license})
          </SubmissionContentText>
        ))}
      </LabelContentRow>
    </>
  );
};

export default SubmissionFilesAndLicenses;
