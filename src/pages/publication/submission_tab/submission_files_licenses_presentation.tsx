import LabelContentLine from '../../../components/LabelContentLine';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { Publication } from '../../../types/publication.types';
import SubmissionContentText from './submission_content_text';

const SubmissionFilesAndLicensesPresentation: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <LabelContentLine label={t('files_and_license.files')}>
        {values.files.map(file => {
          return (
            <SubmissionContentText>
              {file.title}({file.license})
            </SubmissionContentText>
          );
        })}
      </LabelContentLine>
    </>
  );
};

export default SubmissionFilesAndLicensesPresentation;
