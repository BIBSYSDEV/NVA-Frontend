import LabelContentRow from '../../../components/LabelContentRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikProps, useFormikContext } from 'formik';
import { FormikPublication } from '../../../types/publication.types';

const SubmissionFilesAndLicenses: React.FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<FormikPublication> = useFormikContext();

  return (
    <>
      {values.fileSet.map((file: any) => (
        <React.Fragment key={file.id}>
          <hr />
          <LabelContentRow label={t('files_and_license.title')}>{file.name}</LabelContentRow>
          <LabelContentRow label={t('files_and_license.administrative_contract')}>
            {file.administrativeAgreement ? t('common:yes') : t('common:no')}
          </LabelContentRow>
          {!file.administrativeAgreement && (
            <>
              <LabelContentRow label={t('files_and_license.published_version')}>
                {file.publisherAuthority !== null ? (file.publisherAuthority ? t('common:yes') : t('common:no')) : ''}
              </LabelContentRow>
              <LabelContentRow label={t('files_and_license.embargo_date')}>
                {file.embargoDate?.toLocaleDateString()}
              </LabelContentRow>
              <LabelContentRow label={t('files_and_license.license')}>{file.license?.identifier}</LabelContentRow>
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default SubmissionFilesAndLicenses;
